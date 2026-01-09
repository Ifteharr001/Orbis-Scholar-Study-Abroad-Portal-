import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Appointment from "@/models/Appointment";
import User from "@/models/User";

// ১. অ্যাপয়েন্টমেন্ট লিস্ট ফেচ করা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const email = session.user.email;

    // 🚀 Performance Update:
    // .lean() ব্যবহার করা হয়েছে যাতে রেসপন্স দ্রুত হয়
    // .populate() এ কাউন্সিলরের নাম এবং ছবি আনা হচ্ছে
    const appointments = await Appointment.find({ studentEmail: email })
      .populate("counselorId", "name image")
      .sort({ date: 1 }) // তারিখ অনুযায়ী সর্ট (সবচেয়ে কাছের অ্যাপয়েন্টমেন্ট আগে)
      .lean();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Fetch Appointment Error:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

// ২. নতুন অ্যাপয়েন্টমেন্ট বুক করা
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { topic, type, date, time, notes } = body;

    // ১. বেসিক ভ্যালিডেশন
    if (!topic || !date || !time || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();
    
    // ২. অপটিমাইজড কুয়েরি:
    // আমাদের পুরো ইউজার দরকার নেই, শুধু 'assignedCounselor' ফিল্ডটি দরকার।
    // .select("assignedCounselor") ব্যবহার করায় সার্ভারের মেমোরি বাঁচবে।
    const student = await User.findOne({ email: session.user.email }).select("assignedCounselor");
    
    if (!student || !student.counselor) {
      return NextResponse.json({ error: "No counselor assigned yet. Please contact support." }, { status: 400 });
    }

    // ৩. অ্যাপয়েন্টমেন্ট তৈরি
    const newAppointment = await Appointment.create({
      studentEmail: session.user.email,
      counselorId: student.counselor, // স্টুডেন্টের নির্দিষ্ট কাউন্সিলর
      topic,
      type,
      date: new Date(date),
      time,
      notes,
      status: "pending"
    });

    return NextResponse.json(newAppointment, { status: 201 });

  } catch (error) {
    console.error("Book Appointment Error:", error);
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
  }
}