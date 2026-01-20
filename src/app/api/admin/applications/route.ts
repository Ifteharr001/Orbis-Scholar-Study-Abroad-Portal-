import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import User from "@/models/User"; 

export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const stage = searchParams.get("stage") || "all";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (stage !== "all") {
      filter.status = stage;
    }

    if (query) {
      filter.$or = [
        { universityName: { $regex: query, $options: "i" } },
        { programName: { $regex: query, $options: "i" } },
        { applicationId: { $regex: query, $options: "i" } },
        { studentEmail: { $regex: query, $options: "i" } }, 
      ];
    }

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emails = applications.map((app: any) => app.studentEmail);
    const students = await User.find({ email: { $in: emails } }).select("email name image");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enrichedApplications = applications.map((app: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const student = students.find((s: any) => s.email === app.studentEmail);
      return {
        ...app,
        studentName: student ? student.name : "Unknown Student",
        studentImage: student ? student.image : null,
      };
    });

    return NextResponse.json({ applications: enrichedApplications });

  } catch (error) {
    console.error("Fetch Applications Error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}