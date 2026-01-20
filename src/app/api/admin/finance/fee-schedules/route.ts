import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

// ✅ GET: সব ইউনিভার্সিটির ফি স্ট্রাকচার লোড করা
export async function GET() {
  try {
    await connect();
    const data = await University.find({})
      .select("name logo country fees") // শুধু নাম, লোগো এবং ফি দরকার
      .sort({ name: 1 })
      .lean();
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Fetch Failed" }, { status: 500 });
  }
}

// ✅ PUT: ফি আপডেট করা
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, fees } = body;

    if (!id || !fees) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    await connect();

    await University.findByIdAndUpdate(id, {
      $set: { fees: fees }
    });

    return NextResponse.json({ success: true, message: "Fee schedule updated!" });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}