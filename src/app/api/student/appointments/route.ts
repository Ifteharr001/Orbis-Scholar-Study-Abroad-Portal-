import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Appointment from "@/models/Appointment";
import User from "@/models/User";

// ১. অ্যাপয়েন্টমেন্ট লিস্ট ফেচ করা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const email = session.user.email;

    // স্টুডেন্টের সব অ্যাপয়েন্টমেন্ট আনা এবং কাউন্সিলরের নাম পপুলেট করা
    const appointments = await Appointment.find({ studentEmail: email })
      .populate("counselorId", "name image")
      .sort({ date: 1 }); // তারিখ অনুযায়ী সর্ট

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

// ২. নতুন অ্যাপয়েন্টমেন্ট বুক করা
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { topic, type, date, time, notes } = body;

    await connect();
    
    // স্টুডেন্টের কাউন্সিলর খুঁজে বের করা
    const student = await User.findOne({ email: session.user.email });
    
    if (!student || !student.assignedCounselor) {
      return NextResponse.json({ error: "No counselor assigned yet" }, { status: 400 });
    }

    // অ্যাপয়েন্টমেন্ট তৈরি
    const newAppointment = await Appointment.create({
      studentEmail: session.user.email,
      counselorId: student.assignedCounselor,
      topic,
      type,
      date: new Date(date),
      time,
      notes,
      status: "pending"
    });

    return NextResponse.json(newAppointment, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
  }
}