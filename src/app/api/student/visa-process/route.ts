import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import VisaProcess from "@/models/VisaProcess";

// ✅ 1. টাইপ ফিক্স: আমরা টাইপস্ক্রিপ্টকে বলে দিচ্ছি status টি সাধারণ string না, এটি ফিক্সড ভ্যালু।
interface ITask {
  id: number;
  name: string;
  status: "done" | "pending" | "locked" | "verified"; // Exact literals
  auto: boolean;
  hasLink: boolean;
  hasUpload: boolean;
  fileUrl?: string;
  fileName?: string;
}

const DEFAULT_TASKS: ITask[] = [
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    
    let process = await VisaProcess.findOne({ studentEmail: session.user.email });

    if (!process) {
      process = await VisaProcess.create({
        studentEmail: session.user.email,
        progress: 15, 
        tasks: DEFAULT_TASKS, // ✅ এখন আর এরর দিবে না কারণ টাইপ মিলছে
        packingList: DEFAULT_PACKING
      });
    }

    return NextResponse.json(process);
  } catch (error: unknown) { // ✅ catch ব্লকে unknown টাইপ হ্যান্ডেল করা
    console.error("Visa Process GET Error:", error);
    return NextResponse.json({ error: "Failed to load visa process" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tasks, packingList, travel, medicalDate, embassyDate } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (tasks) updateData.tasks = tasks;
    if (packingList) updateData.packingList = packingList;
    if (travel) updateData.travel = travel;
    if (medicalDate) updateData.medicalDate = medicalDate;
    if (embassyDate) updateData.embassyDate = embassyDate;

    if (tasks) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalTasks = tasks.length;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const completedTasks = tasks.filter((t: any) => t.status === "done" || t.status === "verified").length;
        updateData.progress = Math.round((completedTasks / totalTasks) * 100);
    }

    await connect();

    const updatedProcess = await VisaProcess.findOneAndUpdate(
      { studentEmail: session.user.email },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json(updatedProcess);

  } catch (error: unknown) { // ✅ এখানেও ফিক্স করা হলো
    console.error("Visa Process Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}