import { NextResponse } from "next/server";
import { connect } from "@/lib/db"; // আপনার db কানেকশন ফাংশনের নাম যা আছে তাই রাখবেন
import { Invitation } from "@/models/Invitation";
// 👇 পরিবর্তন: { User } এর বদলে শুধু User হবে
import User from "@/models/User"; 
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connect(); // Database connect
    const { email, role } = await req.json();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // 2. Generate Token & Expiry (7 days)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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

    // 4. Send Email (Mocking the email sending here)
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/register?token=${token}`;

    console.log("------------------------------------------------");
    console.log(`EMAIL SENT TO: ${email}`);
    console.log(`ROLE: ${role}`);
    console.log(`LINK: ${inviteLink}`);
    console.log("------------------------------------------------");

    // TODO: Use Nodemailer here to send the actual email with `inviteLink`

    return NextResponse.json({
      message: "Invitation sent successfully",
      link: inviteLink,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}