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

    const applications = await Application.find({
        offerLetterUrl: { $exists: true, $ne: "" } 
    })
    .select("studentEmail firstName lastName universityName programName offerLetterUrl updatedAt")
    .sort({ updatedAt: -1 })
    .lean();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedDocs = applications.map((app: any) => ({
        _id: app._id,
        studentName: `${app.firstName || "Unknown"} ${app.lastName || ""}`.trim() || app.studentEmail,
        studentEmail: app.studentEmail,
        universityName: app.universityName,
        programName: app.programName,
        docType: "Offer Letter", 
        url: app.offerLetterUrl,
        uploadDate: app.updatedAt
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedDocs 
    });

  } catch (error) {
    console.error("Fetch Documents Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}