import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Service from "@/models/Service";

export async function GET(
  req: Request,
  // ✅ ফিক্স: ফোল্ডারের নাম [id], তাই এখানে টাইপ অবশ্যই 'id' হতে হবে
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connect();

    // ১. প্যারামিটার থেকে ভ্যালু বের করা 
    // (URL এ যা থাকবে, Next.js সেটাকে 'id' ভেরিয়েবলে দিবে)
    const { id } = await params;

    // ২. স্লাগ দিয়ে সার্ভিস খোঁজা
    // যদিও ভেরিয়েবলের নাম 'id', কিন্তু এর ভেতরে আপনার স্লাগ টেক্সট আছে।
    // তাই আমরা ডাটাবেসের 'slug' ফিল্ডের সাথে ম্যাচ করে খুঁজব।
    const service = await Service.findOne({ slug: id }).lean();
    
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json(service);

  } catch (error) {
    console.error("Fetch Service Detail Error:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}