import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

export async function GET() {
  try {
    await connect();
    
    // location ফিল্ডটি select এ অ্যাড করা হয়েছে
    const universities = await University.find({}).select("name _id scholarships location").lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allScholarships = universities.flatMap((uni: any) => {
      if (!uni.scholarships || uni.scholarships.length === 0) return [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return uni.scholarships.map((sch: any, index: number) => ({
        id: `${uni._id}-${index}`,
        universityId: uni._id,
        program: sch.name,         // এটিই Major/Subject হিসেবে কাজ করবে
        university: uni.name,
        location: uni.location,    // ✅ নতুন: লোকেশন ফিল্টার করার জন্য
        degree: sch.type,
        language: "English",
        tuitionFee: sch.tuitionFee,
        accommodationFee: sch.accommodationFee,
        scholarshipType: sch.type,
      }));
    });

    return NextResponse.json(allScholarships);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}