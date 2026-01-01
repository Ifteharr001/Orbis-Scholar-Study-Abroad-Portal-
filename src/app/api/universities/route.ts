import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

export async function GET() {
  try {
    await connect();
    const universities = await University.find({}).limit(4).lean();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialized = universities.map((doc: Record<string, any>) => ({
      _id: doc._id?.toString(),
      name: doc.name,
      location: doc.location,
      country: doc.country,
      about: doc.about,
      image: doc.image,
      ranking: doc.ranking,
      founded: doc.founded,
      studentPopulation: doc.studentPopulation,
      acceptanceRate: doc.acceptanceRate,
      tuitionFee: doc.tuitionFee,
      applicationFee: doc.applicationFee,
      programs: doc.programs || [],
      scholarships: doc.scholarships || [],
      faqs: doc.faqs || [],
      gallery: doc.gallery || [],
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();
    
    if (!body.name || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields: name and location" }, 
        { status: 400 }
      );
    }
    
    const newUniversity = await University.create(body);

    return NextResponse.json(
      { message: "University created", data: newUniversity }, 
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    const status = errorMessage.includes("validation") ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status }
    );
  }
}