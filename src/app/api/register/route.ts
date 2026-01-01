import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // ১. রিকোয়েস্ট বডি থেকে ডাটা নেওয়া
    const { fullName, email, password, role, phone, gender, country } = await req.json();

    // ২. বেসিক ভ্যালিডেশন (নাম, ইমেইল, পাসওয়ার্ড না থাকলে এরর)
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields (Name, Email, or Password)" },
        { status: 400 }
      );
    }

    // ৩. ডাটাবেস কানেকশন
    await connect();

    // ৪. ইউজার আগে থেকেই আছে কিনা চেক করা
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // ৫. পাসওয়ার্ড হ্যাশ করা (সিকিউরিটির জন্য)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৬. নতুন ইউজার তৈরি করা
    await User.create({
      name: fullName, // স্কিমাতে 'name' আছে, কিন্তু ফর্ম থেকে 'fullName' আসছে
      email,
      password: hashedPassword,
      role: role || "student", // রোল না থাকলে ডিফল্ট 'student'
      phone,
      gender,
      country,
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