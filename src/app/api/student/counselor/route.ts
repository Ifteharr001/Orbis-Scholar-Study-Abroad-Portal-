import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // ১. স্টুডেন্ট খুঁজে কাউন্সিলর পপুলেট করা
    // .select() ব্যবহার করিনি যাতে সব ফিল্ড ঠিকমতো আসে এবং কনফিউশন না হয়
    const studentResult = await User.findOne({ email: session.user.email })
      .populate({
        path: "counselor", // ⚠️ আপনার মডেলে ফিল্ডের নাম 'counselor' (assignedCounselor নয়)
        select: "-password", // পাসওয়ার্ড বাদে সব আনবে
      })
      .lean();

    if (!studentResult) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // ২. টাইপ সেফটি বাইপাস (any ব্যবহার করে)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const student: any = studentResult;
    const counselor = student.counselor;

    // ৩. যদি কাউন্সিলর অ্যাসাইন করা না থাকে
    if (!counselor) {
      return NextResponse.json({ counselor: null });
    }

    // ৪. রেসপন্স সাজানো (Frontend এ যেভাবে ডাটা দরকার)
    const counselorData = {
      id: counselor._id.toString(),
      name: counselor.name,
      email: counselor.email,
      phone: counselor.phone || "Not provided",
      whatsapp: counselor.phone || "Not provided",
      image: counselor.image || "/placeholder.svg", // ইমেজ না থাকলে ডিফল্ট
      
      // Professional Info (যদি মডেলে না থাকে তবে ডিফল্ট দেখাবে)
      title: counselor.title || "Education Counselor",
      location: counselor.country || "Dhaka, Bangladesh",
      
      // সেফটি চেক: অ্যারে আছে কিনা দেখে তবেই .length চেক করবে
      languages: Array.isArray(counselor.languages) && counselor.languages.length > 0 
        ? counselor.languages 
        : ["English", "Bangla"],
      
      specializations: Array.isArray(counselor.specializations) && counselor.specializations.length > 0
        ? counselor.specializations 
        : ["Study Abroad", "Visa Guidance"],

      // Stats
      rating: counselor.rating || 5.0,
      totalStudents: counselor.totalStudents || 120,
      successRate: counselor.successRate || 98,
      experience: counselor.experience || "3+ years",
      availability: counselor.availability || "Mon - Fri, 10 AM - 6 PM",
      bio: counselor.bio || "Professional counselor dedicated to guiding students towards their dream universities.",
    };

    return NextResponse.json({ counselor: counselorData });

  } catch (error) {
    console.error("Counselor Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}