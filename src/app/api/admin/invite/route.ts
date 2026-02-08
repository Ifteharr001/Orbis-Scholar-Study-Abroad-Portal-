import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { Invitation } from "@/models/Invitation";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connect(); 
    
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { message: "Email and Role are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    const inviteLink = `${baseUrl}/register?token=${token}`;

    console.log("------------------------------------------------");
    console.log(`📨 EMAIL SENT TO: ${email}`);
    console.log(`👤 ROLE: ${role}`);
    console.log(`🔗 LINK: ${inviteLink}`);
    console.log("------------------------------------------------");

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      link: inviteLink,
    });

  } catch (error) {
    console.error("Invite API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}