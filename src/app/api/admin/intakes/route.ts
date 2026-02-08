import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

export async function GET() {
  try {
    await connect();

    const universities = await University.find({})
      .select("name logo country intakes")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ success: true, data: universities });

  } catch (error) {
    console.error("Fetch Intakes Error:", error);
    return NextResponse.json({ error: "Failed to fetch intakes" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, intakes } = body; 

    if (!id || !Array.isArray(intakes)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await connect();

    await University.findByIdAndUpdate(id, {
      $set: { intakes: intakes }
    });

    return NextResponse.json({ success: true, message: "Intakes updated successfully" });

  } catch (error) {
    console.error("Update Intake Error:", error);
    return NextResponse.json({ error: "Failed to update intakes" }, { status: 500 });
  }
}