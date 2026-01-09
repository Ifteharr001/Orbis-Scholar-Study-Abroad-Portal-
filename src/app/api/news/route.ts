import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import News from "@/models/News";

export async function GET() {
  try {
    await connect();
    
    // 🚀 Performance Optimization:
    // ১. .select("-content"): নিউজ ফিডে বিশাল আর্টিকেল লোড না করে শুধু টাইটেল, ছবি ও সামারি আনা হচ্ছে।
    // ২. .lean(): প্লেইন জাভাস্ক্রিপ্ট অবজেক্ট রিটার্ন করবে (ফাস্ট রেন্ডারিং)।
    const news = await News.find({})
      .sort({ createdAt: -1 })
      .select("-content") 
      .lean();

    return NextResponse.json(news);
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();

    // ভ্যালিডেশন: টাইটেল বা কন্টেন্ট না থাকলে এরর দিবে
    if (!body.title || !body.content || !body.category) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newNews = await News.create(body);
    
    return NextResponse.json({ message: "News created successfully", news: newNews }, { status: 201 });
  } catch (error) {
    console.error("Create News Error:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}