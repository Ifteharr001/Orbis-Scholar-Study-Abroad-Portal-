import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import PasswordReset from "@/models/PasswordReset";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connect();

    // Find the reset record with the verified OTP
    const resetRecord = await PasswordReset.findOne({
      otp: "verified",
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json({ message: "Invalid or expired reset session" }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email: resetRecord.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete the reset record
    await PasswordReset.deleteOne({ _id: resetRecord._id });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Reset Password Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}