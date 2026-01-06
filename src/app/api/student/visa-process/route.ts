import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import VisaProcess from "@/models/VisaProcess";

// ডিফল্ট টাস্ক লিস্ট (যদি ডাটাবেসে না থাকে)
const DEFAULT_TASKS = [
  { id: 1, name: "CAS/Offer Letter Received", status: "done", auto: true, hasLink: false, hasUpload: false },
  { id: 2, name: "Visa Application Form (DS-160)", status: "pending", auto: false, hasLink: true, hasUpload: false },
  { id: 3, name: "Visa Fee Payment", status: "pending", auto: false, hasLink: false, hasUpload: true },
  { id: 4, name: "Appointment Booking", status: "locked", auto: false, hasLink: false, hasUpload: false },
  { id: 5, name: "Biometric Submission", status: "locked", auto: false, hasLink: false, hasUpload: false },
  { id: 6, name: "Medical Test Report", status: "locked", auto: false, hasLink: false, hasUpload: true },
];

const DEFAULT_PACKING = [
  { name: "Passport & Visa Copy", checked: false },
  { name: "Flight Tickets", checked: false },
  { name: "University Documents", checked: false },
  { name: "Cash & Cards", checked: false },
  { name: "Winter Clothing", checked: false },
  { name: "Medicines", checked: false },
  { name: "Electronics & Adapters", checked: false },
];

// ১. ডাটা ফেচ করা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    let process = await VisaProcess.findOne({ studentEmail: session.user.email });

    // যদি ডাটা না থাকে, ডিফল্ট তৈরি করো
    if (!process) {
      process = await VisaProcess.create({
        studentEmail: session.user.email,
        progress: 10,
        tasks: DEFAULT_TASKS,
        packingList: DEFAULT_PACKING
      });
    }

    return NextResponse.json(process);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load visa process" }, { status: 500 });
  }
}

// ২. ডাটা আপডেট করা (টাস্ক, অ্যাপয়েন্টমেন্ট, প্যাকিং ইত্যাদি)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connect();

    // যে ফিল্ডগুলো পাঠানো হয়েছে শুধু সেগুলো আপডেট হবে (Partial Update)
    const updatedProcess = await VisaProcess.findOneAndUpdate(
      { studentEmail: session.user.email },
      { $set: body }, // যেমন: { "tasks.1.status": "done" } বা পুরো tasks অ্যারে
      { new: true }
    );

    return NextResponse.json(updatedProcess);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}