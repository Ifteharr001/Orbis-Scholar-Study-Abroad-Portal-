import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Application from "@/models/Application";
import Documents from "@/models/Document"; // ✅ ১. মডেল ইমপোর্ট (আপনার ফাইলের নাম যদি documet.ts হয় তবে পাথ ঠিক করে নিন)

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
    }

    // ২. স্টুডেন্ট খোঁজা
    const student = await User.findById(id).select("-password");

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // ৩. প্যারালাল ডাটা ফেচিং (অ্যাপ্লিকেশন এবং ডকুমেন্ট একসাথে)
    // স্টুডেন্টের ইমেইল দিয়ে অ্যাপ্লিকেশন এবং ডকুমেন্ট খোঁজা হচ্ছে
    const [applications, documents] = await Promise.all([
      Application.find({ studentEmail: student.email }).sort({ createdAt: -1 }),
      Documents.find({ studentEmail: student.email }).sort({ uploadedAt: -1 }) // ✅ ডকুমেন্টস ফেচ করা হলো
    ]);

    // ৪. রেসপন্সে সব ডাটা পাঠানো
    return NextResponse.json({ 
      student, 
      applications,
      documents // ✅ ফ্রন্টএন্ডে পাঠানো হলো
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}