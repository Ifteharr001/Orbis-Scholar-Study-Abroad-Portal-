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

    const [
      pendingTasksCount,
      activeAppsCount,
      distinctStudentEmails,
      upcomingTasks,
      recentApplications
    ] = await Promise.all([
      Task.countDocuments({
        assignedTo: counselorEmail,
        status: { $ne: "Completed" }
      }),

      Application.countDocuments({
        counselorEmail: counselorEmail,
        status: { $nin: ["Rejected", "Cancelled"] }
      }),

      Application.distinct("studentEmail", {
        counselorEmail: counselorEmail
      }),

      Task.find({
        assignedTo: counselorEmail,
        status: { $ne: "Completed" }
      })
      .sort({ priority: -1, dueDate: 1 })
      .limit(5)
      .lean(),

      Application.find({ counselorEmail: counselorEmail })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("studentName studentEmail studentId updatedAt")
        .lean()
    ]);

    // Fetch all student profiles in one query instead of N+1
    const studentEmails = [...new Set(recentApplications.map((app: any) => app.studentEmail))];
    const studentProfiles = await Student.find({ email: { $in: studentEmails } })
      .select("name email phone image")
      .lean();

    // Create a map for quick lookup
    const studentProfileMap = new Map(studentProfiles.map(s => [s.email, s]));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentStudents = recentApplications.map((app: any) => {
      const studentProfile = studentProfileMap.get(app.studentEmail);

      return {
        _id: app.studentId || app._id,
        name: app.studentName,
        email: app.studentEmail,
        image: studentProfile?.image || "",
        joinedAt: app.updatedAt
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueRecentStudents = recentStudents.filter((student, index, self) =>
        index === self.findIndex((t) => (
            t.email === student.email
        ))
    );

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