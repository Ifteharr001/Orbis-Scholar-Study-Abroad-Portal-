import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Application from "@/models/Application"; // Application মডেল ইমপোর্ট

export async function GET(req: Request) {
    
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { role: "student" };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }

    // ১. সব স্টুডেন্ট খুঁজে আনা (lean() ব্যবহার করছি যাতে পেইন JS অবজেক্ট পাই)
    const students = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // ২. এই স্টুডেন্টদের সব ইমেইল বের করা
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentEmails = students.map((s: any) => s.email);

    // ৩. এই ইমেইলগুলোর সব অ্যাপ্লিকেশন খুঁজে আনা
    const applications = await Application.find({ 
      studentEmail: { $in: studentEmails } 
    }).select("studentEmail programName universityName");

    // ৪. স্টুডেন্টদের সাথে তাদের অ্যাপ্লিকেশন মার্জ (Merge) করা
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentsWithApps = students.map((student: any) => {
      const studentApps = applications.filter(
        (app) => app.studentEmail === student.email
      );
      return { 
        ...student, 
        applications: studentApps // অ্যাপ্লিকেশনের লিস্ট ঢুকিয়ে দিলাম
      };
    });

    return NextResponse.json({ students: studentsWithApps });

  } catch (error) {
    console.error("Fetch Students Error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}