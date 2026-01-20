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

    const fraudItems = await Application.find({
        status: "Rejected" 
    })
    .select("studentEmail firstName lastName universityName programName status updatedAt")
    .sort({ updatedAt: -1 })
    .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData = fraudItems.map((app: any) => ({
        _id: app._id,
        studentName: `${app.firstName || "Unknown"} ${app.lastName || ""}`.trim() || app.studentEmail,
        studentEmail: app.studentEmail,
        universityName: app.universityName,
        programName: app.programName,
        status: app.status,
        flaggedDate: app.updatedAt 
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedData 
    });

  } catch (error) {
    console.error("Fetch Fraud Flags Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}