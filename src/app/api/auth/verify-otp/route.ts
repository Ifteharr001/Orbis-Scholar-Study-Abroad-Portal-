import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import PasswordReset from "@/models/PasswordReset";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    await connect();

    const resetRecord = await PasswordReset.findOne({
      email: email.toLowerCase().trim(),
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    // Mark as verified by updating the record (we'll use a flag or just delete after password reset)
    // For now, return a temporary token that can be used for password reset
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    resetRecord.otp = "verified"; // Mark as verified
    resetRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 more minutes to complete password reset
    resetRecord.save();

    return NextResponse.json(
      { message: "OTP verified successfully", resetToken },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Verify OTP Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}