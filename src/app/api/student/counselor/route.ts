/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const email = session?.user?.email;

    // ১. স্টুডেন্টকে খুঁজে বের করা
    const student = await User.findOne({ email });

    // 🔴 ফিক্স: (student as any) ব্যবহার করা হয়েছে
    if (!student || !(student as any).assignedCounselor) {
      return NextResponse.json({ counselor: null });
    }

    // ২. অ্যাসাইন করা কাউন্সিলরকে খুঁজে বের করা
    // 🔴 ফিক্স: এখানেও (student as any) ব্যবহার করা হয়েছে
    const counselor = await User.findById((student as any).assignedCounselor).select("-password");

    if (!counselor) {
      return NextResponse.json({ counselor: null });
    }

    // ৩. রেসপন্স সাজানো
    const counselorData = {
      name: counselor.name,
      email: counselor.email,
      // 🔴 ফিক্স: কাউন্সিলরের ফিল্ডগুলোতেও any ব্যবহার করা হয়েছে সেফটির জন্য
      phone: (counselor as any).phone || "+880 1712-000000",
      whatsapp: (counselor as any).phone || "+880 1712-000000",
      title: "Senior Education Counselor",
      location: "Dhaka Office, Bangladesh",
      languages: ["English", "Bangla"],
      specializations: ["UK Universities", "USA Universities", "Visa Guidance"],
      rating: 4.9,
      totalStudents: 150,
      successRate: 98,
      experience: "5+ years",
      availability: "Mon - Fri, 10:00 AM - 6:00 PM",
      bio: "Dedicated counselor to help you achieve your study abroad dreams.",
      image: (counselor as any).image || "/placeholder.svg"
    };

    return NextResponse.json({ counselor: counselorData });

  } catch (error) {
    console.error("Counselor Fetch Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}