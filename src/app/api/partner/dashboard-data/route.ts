export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Application from "@/models/Application";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const email = session.user.email;

    // Find the partner user
    const partner = await User.findOne({ email, role: "partner" }).lean();
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    // Find students associated with this partner (assuming partner is linked to students)
    // For now, let's find all students - in a real app you'd link students to partners
    const students = await User.find({ role: "student" })
      .select("fullName email country status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Find applications for these students
    const studentEmails = students.map(s => s.email);
    const applications = await Application.find({ studentEmail: { $in: studentEmails } })
      .select("studentEmail universityName programName status appliedDate")
      .lean();

    // Calculate stats
    const totalStudents = students.length;
    const activeApplications = applications.filter(a =>
      ["pending", "submitted", "under review", "in progress"].includes(a.status.toLowerCase())
    ).length;
    const completedApplications = applications.filter(a =>
      ["approved", "offer received", "completed", "accepted"].includes(a.status.toLowerCase())
    ).length;

    // Calculate pending verifications (applications pending document review)
    const pendingVerifications = applications.filter(a =>
      a.status.toLowerCase() === "pending documents" || a.status.toLowerCase() === "document review"
    ).length;

    const stats = {
      totalStudents,
      activeApplications,
      completedApplications,
      totalRevenue: 0, // TODO: Calculate from payments
      pendingVerifications,
    };

    // Format students for table
    const formattedStudents = students.map(s => ({
      _id: s._id.toString(),
      fullName: s.name,
      email: s.email,
      country: s.country || "N/A",
      status: s.status || "active",
      createdAt: s.createdAt,
    }));

    return NextResponse.json({
      stats,
      students: formattedStudents,
    });

  } catch (error) {
    console.error("Partner Dashboard Data Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}