import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { Invitation } from "@/models/Invitation";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail, generateInvitationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();
    const { email, role } = body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedRole = typeof role === "string" ? role.trim().toLowerCase() : "";
    const allowedRoles = ["admin", "counselor", "staff", "owner"];

    if (!normalizedEmail || !normalizedRole) {
      return NextResponse.json(
        { message: "Email and Role are required" },
        { status: 400 }
      );
    }

    if (!allowedRoles.includes(normalizedRole)) {
      return NextResponse.json(
        { message: "Invalid invitation role" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Invitation.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        role: normalizedRole,
        token,
        status: "pending",
        expiresAt,
      },
      { upsert: true, new: true }
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const inviteLink = `${baseUrl}/register?token=${token}`;

    // Send invitation email
    const { subject, html, text } = generateInvitationEmail(inviteLink, normalizedRole);
    const emailSent = await sendEmail({ to: normalizedEmail, subject, html, text });

    if (!emailSent && process.env.NODE_ENV === "production") {
      console.warn("[EMAIL] Failed to send invitation email to:", normalizedEmail);
    }

    // Also log for development
    console.log("------------------------------------------------");
    console.log(`📨 EMAIL SENT TO: ${normalizedEmail}`);
    console.log(`👤 ROLE: ${normalizedRole}`);
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