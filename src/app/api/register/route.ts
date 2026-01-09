import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // নতুন ফিল্ড programPreference সহ ডাটা রিসিভ করা হচ্ছে
    const { fullName, email, password, role, phone, gender, country, programPreference } = body;

    // ১. বেসিক ভ্যালিডেশন
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields (Name, Email, or Password)" },
        { status: 400 }
      );
    }

    // ২. পাসওয়ার্ড লেন্থ চেক (মডেলের সাথে মিলিয়ে)
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    await connect();

    // ৩. ডুপ্লিকেট ইউজার চেক
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // ৪. সিকিউরিটি চেক: কেউ যেন রেজিস্ট্রেশন করে 'Admin' বা 'Counselor' হতে না পারে
    // পাবলিক রেজিস্ট্রেশনে শুধু 'student' অথবা 'partner' হতে পারবে
    const safeRole = (role === "partner") ? "partner" : "student";

    // ৫. পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৬. ইউজার তৈরি করা
    await User.create({
      name: fullName, // ফ্রন্টএন্ড পাঠাচ্ছে fullName, মডেলে সেভ হচ্ছে name হিসেবে
      email,
      password: hashedPassword,
      role: safeRole, // 🔒 স্যানিটাইজড রোল
      phone,
      gender,
      country,
      // নতুন ফিল্ড (ডিফল্ট মান হ্যান্ডেল করা হলো)
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