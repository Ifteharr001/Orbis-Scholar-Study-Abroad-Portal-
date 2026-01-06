import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";

// ১. প্রোফাইল ডাটা ফেচ করা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const user = await User.findOne({ email: session.user.email }).select("-password");

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      fullName: user.name,
      email: user.email,
      phone: user.phone || "",
      country: user.country || "",
      gender: user.gender || "",
      programPreference: user.programPreference || "Masters", // আপনার মডেলে এই ফিল্ড থাকতে হবে, না থাকলে ডিফল্ট দেখাবে
      image: user.image || ""
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// ২. প্রোফাইল আপডেট করা
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { fullName, phone, country, gender, programPreference } = body;

    await connect();

    // ডাটাবেস আপডেট
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        name: fullName, 
        phone, 
        country, 
        gender,
        programPreference 
        // নোট: আপনার User মডেলে 'programPreference' ফিল্ডটি যোগ করে নিয়েন যদি না থাকে
      },
      { new: true }
    );

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}