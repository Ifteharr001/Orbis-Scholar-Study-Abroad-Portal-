import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import News from "@/models/News";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connect();

    const { id } = await params; 

    const news = await News.findById(id);
    
    if (!news) return NextResponse.json({ error: "News not found" }, { status: 404 });
    
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch details" }, { status: 500 });
  }
}