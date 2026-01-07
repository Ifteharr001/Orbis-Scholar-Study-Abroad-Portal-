import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";

// GET Method: অফার লোড করার জন্য
export async function GET(req: Request) {
  try {
    await connect();

    // URL থেকে ইমেইল বের করা (যেমন: ?email=student@example.com)
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Student email is required" },
        { status: 400 }
      );
    }

    const applications = await Application.find({ studentEmail: email }).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      data: applications 
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Offers Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { message: "Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}