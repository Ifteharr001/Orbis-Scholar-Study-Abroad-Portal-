import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
    }

    await connect();

    const student = await User.findById(studentId).select("email name");

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const payments = await Payment.find({
      $or: [
        { studentId: studentId },
        { studentEmail: student.email }
      ]
    }).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      data: payments
    });

  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Finance API Error:", error);
    return NextResponse.json({ error: "Failed to fetch finance records" }, { status: 500 });
  }
}