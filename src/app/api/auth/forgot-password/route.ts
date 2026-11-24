import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { sendEmail, generateOTPEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, loginType } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    if (!loginType) {
      return NextResponse.json({ message: "Login type is required" }, { status: 400 });
    }

    await connect();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // For security, you can either return 400 or a generic message. Let's return 400 so the user knows if their account exists.
      return NextResponse.json({ message: "No account found with this email address" }, { status: 400 });
    }

    // Validate that the email belongs to the correct role
    if (user.role !== loginType) {
      const roleMessages: Record<string, string> = {
        student: "This email is registered as a student. Please use the student login page.",
        partner: "This email is registered as a partner. Please use the partner login page.",
        counselor: "This email is registered as a counselor. Please use the counselor login page.",
      };
      return NextResponse.json(
        { message: roleMessages[loginType] || "This email is not registered for this login type" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Remove existing reset requests for this email
    await PasswordReset.deleteMany({ email: user.email });

    await PasswordReset.create({
      email: user.email,
      otp,
      expiresAt,
    });

    // Determine login type for email template
    const type = loginType || (user.role === "student" ? "student" : user.role === "partner" ? "partner" : "counselor");

    // Send OTP via email
    const { subject, html, text } = generateOTPEmail(otp, type);
    const emailSent = await sendEmail({ to: user.email, subject, html, text });

    if (!emailSent && process.env.NODE_ENV === "production") {
      console.warn("[EMAIL] Failed to send OTP email to:", user.email);
    }

    // In development, also log the OTP for testing
    if (process.env.NODE_ENV === "development") {
      console.log(`[PASSWORD RESET OTP] For ${user.email}: ${otp}`);
    }

    return NextResponse.json(
      { message: "OTP sent successfully to your email", debugOtp: process.env.NODE_ENV === "development" ? otp : undefined },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Forgot Password Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
