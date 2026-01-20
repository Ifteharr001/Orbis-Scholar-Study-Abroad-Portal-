import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { Invitation } from "@/models/Invitation";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connect(); // Database connect
    
    const body = await req.json();
    const { email, role } = body;

    // 1. Basic Validation
    if (!email || !role) {
      return NextResponse.json(
        { message: "Email and Role are required" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists in User collection
    // (যদি ইউজার অলরেডি রেজিস্টার্ড থাকে, তাকে ইনভাইট করার দরকার নেই)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // 3. Generate Token & Expiry (7 days validity)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // 4. Upsert Invitation (Update if exists, Insert if new)
    // এতে একই ইমেইলে বারবার ইনভাইট পাঠালে টোকেন আপডেট হয়ে যাবে
    await Invitation.findOneAndUpdate(
      { email },
      {
        email,
        role,
        token,
        status: "pending",
        expiresAt,
      },
      { upsert: true, new: true }
    );

    // 5. Generate Link
    // এনভায়রনমেন্ট ভেরিয়েবল না থাকলে লোকালহোস্ট ফলব্যাক হিসেবে কাজ করবে
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // আমরা ইউজারকে /register পেজে পাঠাবো টোকেন সহ
    const inviteLink = `${baseUrl}/register?token=${token}`;

    // 6. Send Email (Mocking for now)
    console.log("------------------------------------------------");
    console.log(`📨 EMAIL SENT TO: ${email}`);
    console.log(`👤 ROLE: ${role}`);
    console.log(`🔗 LINK: ${inviteLink}`);
    console.log("------------------------------------------------");

    // TODO: Integrate Nodemailer here later

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      link: inviteLink, // ফ্রন্টএন্ডে দেখানোর জন্য লিংক রিটার্ন করছি
    });

  } catch (error) {
    console.error("Invite API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}