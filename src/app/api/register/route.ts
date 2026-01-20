import { NextResponse } from "next/server";
import { connect } from "@/lib/db"; // আপনার DB কানেকশন পাথ
import User from "@/models/User";   // ⚠️ Default import ব্যবহার করবেন
import { Invitation } from "@/models/Invitation";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // ১. ডাটাবেস কানেকশন
    await connect();

    // ২. রিকোয়েস্ট বডি থেকে ডাটা নেওয়া
    const { token, name, password } = await req.json();

    // ভ্যালিডেশন
    if (!token || !name || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // ৩. টোকেন চেক করা (এটি ভ্যালিড কিনা এবং মেয়াদ আছে কিনা)
    const invite = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() }, // বর্তমান সময়ের চেয়ে মেয়াদ বেশি হতে হবে
    });

    if (!invite) {
      return NextResponse.json(
        { message: "Invalid or expired invitation token" },
        { status: 400 }
      );
    }

    // ৪. ইউজার অলরেডি আছে কিনা চেক করা (সুরক্ষার জন্য ডাবল চেক)
    const existingUser = await User.findOne({ email: invite.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // ৫. পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৬. নতুন ইউজার তৈরি করা
    // এখানে role এবং email ইনভাইটেশন ডেটা থেকে নেওয়া হচ্ছে (User input থেকে নয়)
    await User.create({
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role, // Admin, Counselor, Staff, etc.
      status: "active",  // বা আপনার User মডেলে status যেভাবে ডিফাইন করা আছে
    });

    // ৭. ইনভাইটেশন স্ট্যাটাস আপডেট করা
    invite.status = "accepted";
    await invite.save();

    // সফল রেসপন্স
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