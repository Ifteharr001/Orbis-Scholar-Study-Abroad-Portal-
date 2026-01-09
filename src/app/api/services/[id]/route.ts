import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Service from "@/models/Service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> } // ✅ আমরা এখন 'slug' এক্সপেক্ট করছি
) {
  try {
    await connect();

    // ১. প্যারামিটার থেকে স্লাগ বের করা
    const { slug } = await params;

    // ২. স্লাগ দিয়ে সার্ভিস খোঁজা (ID দিয়ে নয়)
    // .lean() ব্যবহার করছি যাতে রেসপন্স ফাস্ট হয়
    const service = await Service.findOne({ slug }).lean();
    
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json(service);

  } catch (error) {
    console.error("Fetch Service Detail Error:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}