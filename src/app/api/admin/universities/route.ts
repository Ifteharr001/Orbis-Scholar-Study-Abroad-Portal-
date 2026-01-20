import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

// ✅ GET: সব ইউনিভার্সিটি লিস্ট আনার জন্য
export async function GET(req: Request) {
  try {
    await connect();
    // সব ফিল্ড আনার দরকার নেই, শুধু টেবিলে যা দেখাব তা আনলেই ফাস্ট হবে
    const universities = await University.find({})
      .select("name country location ranking slug image createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: universities });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// ✅ POST: নতুন ইউনিভার্সিটি তৈরি করার জন্য (Basic)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connect();

    // Slug জেনারেট করা (যদি না থাকে)
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }

    // ডুপ্লিকেট চেক
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