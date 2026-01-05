import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 Pattern
) {
  try {
    await connect();
    const { id } = await params; // await params (Next.js 15)

    const application = await Application.findById(id);

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}