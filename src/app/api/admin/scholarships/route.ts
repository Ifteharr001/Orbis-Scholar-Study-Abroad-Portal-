import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

// ✅ GET: সব স্কলারশিপ লোড করার জন্য
export async function GET() {
  try {
    await connect();

    // ইউনিভার্সিটি এবং তার স্কলারশিপগুলো আনছি
    const universities = await University.find({})
      .select("name _id scholarships logo country")
      .lean();

    // Data Flattening: সব স্কলারশিপ এক লেভেলে নিয়ে আসা হচ্ছে
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allScholarships = universities.flatMap((uni: any) => 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (uni.scholarships || []).map((sch: any) => ({
        ...sch,
        _id: sch._id || sch.id, // সাব-ডকুমেন্ট আইডি
        universityId: uni._id,
        universityName: uni.name,
        universityLogo: uni.logo,
        country: uni.country
      }))
    );

    return NextResponse.json({ success: true, data: allScholarships });

  } catch (error) {
    console.error("Fetch Scholarships Error:", error);
    return NextResponse.json({ error: "Failed to fetch scholarships" }, { status: 500 });
  }
}

// ✅ DELETE: একটি নির্দিষ্ট স্কলারশিপ ডিলিট করার জন্য
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const scholarshipId = searchParams.get("id");
    const universityId = searchParams.get("uniId");

    if (!scholarshipId || !universityId) {
      return NextResponse.json({ error: "IDs are required" }, { status: 400 });
    }

    await connect();

    // $pull অপারেটর দিয়ে অ্যারে থেকে রিমুভ করা হচ্ছে
    await University.findByIdAndUpdate(universityId, {
      $pull: { scholarships: { _id: scholarshipId } }
    });

    return NextResponse.json({ success: true, message: "Scholarship deleted successfully" });

  } catch (error) {
    console.error("Delete Scholarship Error:", error);
    return NextResponse.json({ error: "Failed to delete scholarship" }, { status: 500 });
  }
}