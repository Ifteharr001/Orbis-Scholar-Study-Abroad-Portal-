import { NextResponse } from "next/server";
import { connect } from "@/lib/db"; 
import User from "@/models/User";  
import { Invitation } from "@/models/Invitation";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connect();

    const { token, name, password } = await req.json();

    if (!token || !name || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const invite = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (!invite) {
      return NextResponse.json(
        { message: "Invalid or expired invitation token" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: invite.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role, 
      status: "active", 
    });

    invite.status = "accepted";
    await invite.save();

    return NextResponse.json(
      { message: "Admin account registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}