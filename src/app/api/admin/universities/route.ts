import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

export async function GET(req: Request) {
  try {
    await connect();
  const universities = await University.find({})
  .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: universities });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connect();

    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }

    const existing = await University.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: "University with this name already exists" }, { status: 400 });
    }

    const newUniversity = await University.create(body);
    return NextResponse.json({ success: true, data: newUniversity });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}