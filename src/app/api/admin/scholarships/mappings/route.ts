import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

export async function GET() {
  try {
    await connect();
    const data = await University.find({})
      .select("name _id programs scholarships")
      .lean();
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Fetch Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { universityId, scholarshipId, programIds } = body;

    if (!universityId || !scholarshipId || !Array.isArray(programIds)) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    await connect();

    await University.updateOne(
      { _id: universityId, "scholarships._id": scholarshipId },
      {
        $set: {
          "scholarships.$.applicablePrograms": programIds
        }
      }
    );

    return NextResponse.json({ success: true, message: "Mapping updated successfully!" });

  } catch (error) {
    console.error("Mapping Update Error:", error);
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}