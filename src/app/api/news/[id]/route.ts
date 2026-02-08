import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import News from "@/models/News";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connect();

    const { id } = await params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid News ID" }, { status: 400 });
    }

    const news = await News.findById(id).lean();
    
    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }
    
    return NextResponse.json(news);

  } catch (error) {
    console.error("News Detail API Error:", error);
    return NextResponse.json({ error: "Failed to fetch details" }, { status: 500 });
  }
}