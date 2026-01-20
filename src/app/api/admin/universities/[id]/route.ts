import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

// ✅ GET: সিঙ্গেল ইউনিভার্সিটি ডাটা আনার জন্য (Edit পেজে দেখানোর জন্য)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Next.js 15+ compatible
    await connect();
    
    const university = await University.findById(id);
    
    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: university });
  } catch (error) {
    console.error("Error fetching university:", error);
    return NextResponse.json({ error: "Failed to fetch university" }, { status: 500 });
  }
}

// ✅ PUT: ইউনিভার্সিটি আপডেট করার জন্য
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await connect();

    // Slug আপডেট করলে ডুপ্লিকেট চেক (Optional)
    if (body.slug) {
        const existing = await University.findOne({ slug: body.slug, _id: { $ne: id } });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists!" }, { status: 400 });
        }
    }

    const updatedUniversity = await University.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedUniversity) {
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUniversity });
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json({ error: "Failed to update university" }, { status: 500 });
  }
}

// ✅ DELETE: আগের ডিলিট মেথড (যদি লাগে)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connect();
    await University.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}