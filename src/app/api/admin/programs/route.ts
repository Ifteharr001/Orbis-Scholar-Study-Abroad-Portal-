import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

// ✅ GET: সব প্রোগ্রাম লোড করার জন্য
export async function GET() {
  try {
    await connect();

    // শুধু প্রয়োজনীয় ফিল্ডগুলো আনছি
    const universities = await University.find({})
      .select("name _id programs logo country location")
      .lean();

    // ডাটা ফ্ল্যাট (Flatten) করা হচ্ছে: যাতে সব প্রোগ্রাম এক লেভেলে চলে আসে
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allPrograms = universities.flatMap((uni: any) => 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      uni.programs.map((prog: any) => ({
        ...prog,
        _id: prog._id || prog.id, // সাব-ডকুমেন্ট আইডি
        universityId: uni._id,
        universityName: uni.name,
        universityLogo: uni.logo,
        country: uni.country,
        location: uni.location
      }))
    );

    return NextResponse.json({ success: true, data: allPrograms });

  } catch (error) {
    console.error("Fetch Programs Error:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

// ✅ DELETE: একটি নির্দিষ্ট প্রোগ্রাম ডিলিট করার জন্য
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const programId = searchParams.get("id");
    const universityId = searchParams.get("uniId");

    if (!programId || !universityId) {
      return NextResponse.json({ error: "IDs are required" }, { status: 400 });
    }

    await connect();

    // $pull অপারেটর ব্যবহার করে অ্যারে থেকে অবজেক্ট রিমুভ করা হচ্ছে
    await University.findByIdAndUpdate(universityId, {
      $pull: { programs: { _id: programId } }
    });

    return NextResponse.json({ success: true, message: "Program deleted successfully" });

  } catch (error) {
    console.error("Delete Program Error:", error);
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}