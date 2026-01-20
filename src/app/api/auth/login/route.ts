import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; 
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await connect();
    
    const { email, password } = await req.json();

    console.log("🚀 Login Attempt for:", email);

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      console.log("❌ User not found or password missing (Social Login?)");
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      console.log("❌ Account is not active. Status:", user.status);
      return NextResponse.json(
        { message: "Your account is inactive or blocked." },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-it");
    const token = await new SignJWT({ 
        userId: user._id, 
        email: user.email, 
        role: user.role 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    const cookieStore = await cookies();
    
    cookieStore.set("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });

    console.log("Login Successful. Token Set.");

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      },
    });

  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("🔥 Login Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}