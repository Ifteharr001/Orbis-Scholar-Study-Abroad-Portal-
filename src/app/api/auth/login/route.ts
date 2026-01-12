import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // ১. ডাটাবেস কানেকশন
    await connect();
    
    // ২. ডাটা রিসিভ করা (সবার আগে এটি করতে হবে)
    const { email, password } = await req.json();

    // --- DEBUG LOGS START ---
    console.log("------------------------------------------------");
    console.log("1. Login Attempt for:", email);
    // --- DEBUG LOGS END ---

    // ৩. ইউজার খোঁজা (পাসওয়ার্ড সহ)
    const user = await User.findOne({ email }).select("+password");

    // --- DEBUG LOGS ---
    console.log("2. User Found in DB:", user ? "YES" : "NO");
    if (user) {
        console.log("   - Role:", user.role);
        console.log("   - Status:", user.status);
        console.log("   - Has Password:", user.password ? "YES" : "NO");
    }
    // ------------------

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ৪. একাউন্ট স্ট্যাটাস চেক করা
    if (user.status !== "active") {
      console.log("3. Status Check Failed: User is", user.status);
      return NextResponse.json(
        { message: "Your account is inactive or blocked." },
        { status: 403 }
      );
    }

    // ৫. পাসওয়ার্ড চেক
    if (!user.password) {
      console.log("3. Password Check Failed: No password set (Social Login?)");
      return NextResponse.json(
        { message: "Please login using Google or your social account." },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("3. Password Match Result:", isMatch); // এটি true আসা উচিত

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ৬. JWT টোকেন তৈরি করা
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key-change-it",
      { expiresIn: "1d" }
    );

    // ৭. কুকি সেট করা (Next.js 15 এ await বাধ্যতামূলক)
    const cookieStore = await cookies();
    
    cookieStore.set("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // ১ দিন
      path: "/",
    });

    console.log("4. Login Successful, Token Set");
    console.log("------------------------------------------------");

    // ৮. সফল রেসপন্স পাঠানো
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error Catch Block:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}