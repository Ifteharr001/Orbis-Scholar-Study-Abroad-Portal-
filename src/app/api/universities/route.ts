import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10"); 
    const featured = searchParams.get("featured"); 

   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (featured === "true") {
    
      query.ranking = { $lte: 100 }; 
    }

    const universities = await University.find(query)
      .limit(limit)
      .sort({ ranking: 1 }) 
      .select("name slug location country image ranking tuitionFee") 
      .lean();

    return NextResponse.json(universities);

  } catch (error) {
    console.error("Fetch Universities Error:", error);
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();
    
    if (!body.name || !body.location || !body.country) {
      return NextResponse.json(
        { error: "Missing required fields: name, location, or country" }, 
        { status: 400 }
      );
    }

    let slug = body.slug;
    if (!slug) {
      slug = createSlug(body.name);
    }

    const universityData = {
        ...body,
        slug
    };
    
    const newUniversity = await University.create(universityData);

    return NextResponse.json(
      { message: "University created successfully", data: newUniversity }, 
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("Create University Error:", error);
    
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
        return NextResponse.json(
            { error: "A university with this name or slug already exists." }, 
            { status: 409 }
        );
    }
    
    return NextResponse.json(
      { error: err.message || "Unknown error occurred" }, 
      { status: 500 }
    );
  }
}