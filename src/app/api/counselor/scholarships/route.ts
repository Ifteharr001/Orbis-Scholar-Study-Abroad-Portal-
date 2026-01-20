import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connect();

    const universities = await University.find({})
      .select("name _id scholarships logo country")
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allScholarships = universities.flatMap((uni: any) => 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (uni.scholarships || []).map((sch: any) => ({
        ...sch,
        _id: sch._id || sch.id, 
        universityId: uni._id,
        universityName: uni.name,
        universityLogo: uni.logo,
        country: uni.country
      }))
    );

    return NextResponse.json({ success: true, data: allScholarships });

  } catch (error) {
    console.error("Counselor Scholarship Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch scholarships" }, { status: 500 });
  }
}