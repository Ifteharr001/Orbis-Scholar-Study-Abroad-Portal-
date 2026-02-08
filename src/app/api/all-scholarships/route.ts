import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University, { IUniversity, IScholarship } from "@/models/University";

export async function GET() {
  try {
    await connect();

    const universities = await University.find({})
      .select("name slug location scholarships logo") 
      .lean();

    const allScholarships = universities.flatMap((uni) => {
      const u = uni as unknown as IUniversity; 

      if (!u.scholarships || u.scholarships.length === 0) return [];

      return u.scholarships.map((sch: IScholarship, index: number) => ({
        id: `${u._id}-${index}`, 
        universityId: u._id,
        universityName: u.name,
        universitySlug: u.slug,
        location: u.location,
        logo: u.logo || "/placeholder-logo.png", 

        program: sch.name,        
        degree: sch.type,         
        language: "English",    
        
        tuitionFee: sch.tuitionFee,
        accommodationFee: sch.accommodationFee,
        scholarshipType: sch.type, 
        
        monthlyStipend: sch.monthlyStipend || "N/A",
        yearlyStipend: sch.yearlyStipend || "N/A",
      }));
    });

    return NextResponse.json(allScholarships);
  } catch (error) {
    console.error("Scholarship API Error:", error); 
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}