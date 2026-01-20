import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

// ✅ GET: ম্যাপিং পেজের জন্য সব ইউনিভার্সিটি, প্রোগ্রাম এবং স্কলারশিপ আনা
export async function GET() {
  try {
    await connect();
    const data = await University.find({})
      .select("name _id programs scholarships") // শুধু প্রয়োজনীয় ডাটা
      .lean();
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Fetch Error" }, { status: 500 });
  }
}

// ✅ PUT: ম্যাপিং সেভ করার জন্য
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { universityId, scholarshipId, programIds } = body;

    if (!universityId || !scholarshipId || !Array.isArray(programIds)) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    await connect();

    // 🔥 Mongoose ArrayFilter ব্যবহার করে নেস্টেড অ্যারে আপডেট করা
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