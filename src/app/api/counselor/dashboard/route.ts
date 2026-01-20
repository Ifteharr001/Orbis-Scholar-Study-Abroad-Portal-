import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import Task from "@/models/Task";
import Student from "@/models/Student";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const counselorEmail = session.user.email;

    // ১. সমান্তরালভাবে (Parallel) ডাটা ফেচ করা (Performance এর জন্য)
    const [
      pendingTasksCount,
      activeAppsCount,
      distinctStudentEmails,
      upcomingTasks,
      recentApplications
    ] = await Promise.all([
      // A. Pending Tasks Count (Assigned TO this counselor)
      Task.countDocuments({ 
        assignedTo: counselorEmail, 
        status: { $ne: "Completed" } 
      }),

      // B. Active Applications Count (Assigned TO this counselor)
      Application.countDocuments({ 
        counselorEmail: counselorEmail,
        status: { $nin: ["Rejected", "Cancelled"] } 
      }),

      // C. Unique Students Count (Based on assigned applications)
      Application.distinct("studentEmail", { 
        counselorEmail: counselorEmail 
      }),

      // D. Upcoming Tasks List (Top 5)
      Task.find({ 
        assignedTo: counselorEmail, 
        status: { $ne: "Completed" } 
      })
      .sort({ priority: -1, dueDate: 1 }) // High priority & soonest due date first
      .limit(5)
      .lean(),

      // E. Recent Applications (To find recent students)
      Application.find({ counselorEmail: counselorEmail })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("studentName studentEmail studentId updatedAt")
        .lean()
    ]);

    // ২. রিসেন্ট স্টুডেন্টদের ডাটা প্রসেস করা
    // (আমরা অ্যাপ্লিকেশন থেকে ডাটা নিচ্ছি, প্রয়োজনে স্টুডেন্ট মডেল থেকেও ইমেজ আনা যেতে পারে)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentStudents = await Promise.all(recentApplications.map(async (app: any) => {
        // অপশনাল: স্টুডেন্ট মডেল থেকে ইমেজ বা ফোন নাম্বার আনা
        const studentProfile = await Student.findOne({ email: app.studentEmail }).select("phone").lean();
        
        return {
            _id: app.studentId || app._id, // স্টুডেন্ট আইডি না থাকলে অ্যাপ আইডি (ফলব্যাক)
            name: app.studentName,
            email: app.studentEmail,
            image: "", // স্টুডেন্টের ইমেজ থাকলে এখানে বসাবেন (User মডেল থেকে)
            joinedAt: app.updatedAt // বা assignedAt
        };
    }));

    // ৩. ডুপ্লিকেট স্টুডেন্ট রিমুভ করা (যদি একই স্টুডেন্টের একাধিক অ্যাপ রিসেন্টলি আপডেট হয়)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueRecentStudents = recentStudents.filter((student, index, self) =>
        index === self.findIndex((t) => (
            t.email === student.email
        ))
    );

    // ৪. ফাইনাল রেসপন্স তৈরি
    return NextResponse.json({
      totalStudents: distinctStudentEmails.length,
      activeApplications: activeAppsCount,
      pendingTasks: pendingTasksCount,
      recentStudents: uniqueRecentStudents,
      upcomingTasks: upcomingTasks
    });

  } catch (error) {
    console.error("Counselor Dashboard Error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}