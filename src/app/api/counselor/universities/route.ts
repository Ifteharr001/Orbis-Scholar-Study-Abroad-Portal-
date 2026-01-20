import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connect();

    const universities = await University.find({})
      .sort({ createdAt: -1 }); 

    return NextResponse.json({
      success: true,
      data: universities,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}