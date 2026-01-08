import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import News from "@/models/News";

export async function GET() {
  try {
    await connect();
    const news = await News.find().sort({ createdAt: -1 });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();
    const newNews = await News.create(body);
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}