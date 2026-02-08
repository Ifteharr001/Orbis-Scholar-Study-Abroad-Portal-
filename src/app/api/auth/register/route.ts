import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { fullName, email, password, role, phone, gender, country, programPreference } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields (Name, Email, or Password)" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    await connect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const safeRole = (role === "partner") ? "partner" : "student";

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: fullName, 
      email,
      password: hashedPassword,
      role: safeRole,
      phone,
      gender,
      country,
      programPreference: programPreference || "Masters", 
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (error: unknown) { 
    console.error("Registration Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}