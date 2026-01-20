import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Appointment from "@/models/Appointment"; 
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const email = session.user.email;

    const appointments = await Appointment.find({ studentEmail: email })
      .populate("counselorId", "name image")
      .sort({ date: 1 }) 
      .lean();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Fetch Appointment Error:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { topic, type, date, time, notes } = body;

    if (!topic || !date || !time || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();
    
    const student = await User.findOne({ email: session.user.email }).select("counselor");
    
    if (!student || !student.counselor) {
      return NextResponse.json({ error: "No counselor assigned yet." }, { status: 400 });
    }

    const newAppointment = await Appointment.create({
      studentId: student._id.toString(), 
      studentEmail: session.user.email,
      counselorId: student.counselor, 
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