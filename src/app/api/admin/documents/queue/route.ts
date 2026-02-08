import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const queueItems = await Application.find({
        status: { $in: ["Docs Pending", "Inquiry", "In Review"] } 
    })
    .select("studentEmail firstName lastName universityName programName status createdAt appliedDate")
    .sort({ updatedAt: -1 }) 
    .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedQueue = queueItems.map((app: any) => ({
        _id: app._id,
        studentName: `${app.firstName || "Unknown"} ${app.lastName || ""}`.trim() || app.studentEmail,
        studentEmail: app.studentEmail,
        universityName: app.universityName,
        programName: app.programName,
        status: app.status,
        appliedDate: app.createdAt || app.appliedDate
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedQueue 
    });

  } catch (error) {
    console.error("Fetch Queue Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}