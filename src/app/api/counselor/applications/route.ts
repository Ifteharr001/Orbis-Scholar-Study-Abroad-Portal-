import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import Student from "@/models/Student"; 
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    await connect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-it");
    const { payload } = await jwtVerify(token, secret);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const counselorId = (payload as any).id;

    const myStudents = await Student.find({ counselor: counselorId }).select("email");

    if (!myStudents || myStudents.length === 0) {
        return NextResponse.json({ success: true, applications: [] });
    }

    const studentEmails = myStudents.map(student => student.email);

    const applications = await Application.find({ studentEmail: { $in: studentEmails } })
      .select("applicationId firstName lastName studentEmail universityName programName status appliedDate createdAt")
      .sort({ updatedAt: -1 }) 
      .lean();

    return NextResponse.json({ 
        success: true, 
        applications 
    });

  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Counselor Applications API Error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}