import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University from "@/models/University";

// স্লাগ জেনারেটর ফাংশন
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

    // URL Query Parameters রিড করা
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10"); // ডিফল্ট ১০টি দেখাবে
    const featured = searchParams.get("featured"); // যদি ?featured=true থাকে

    // কুয়েরি ফিল্টার তৈরি
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (featured === "true") {
      // যদি আপনার মডেলে featured ফিল্ড থাকে তবে এটি কাজ করবে, 
      // না থাকলে এটি ইগনোর করতে পারেন বা ranking দিয়ে ফিল্টার করতে পারেন
      query.ranking = { $lte: 100 }; // উদাহরণ: টপ ১০০ র‍্যাংকিং
    }

    // 🚀 Performance Optimization:
    // লিস্ট পেজে পুরো ডিটেইলস (faqs, gallery, programs) দরকার নেই।
    // .select() ব্যবহার করে শুধু কার্ড দেখানোর জন্য প্রয়োজনীয় ডাটা আনা হচ্ছে।
    const universities = await University.find(query)
      .limit(limit)
      .sort({ ranking: 1 }) // র‍্যাংকিং অনুযায়ী সর্ট (ভাল র‍্যাংক আগে)
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
    
    // ১. ভ্যালিডেশন
    if (!body.name || !body.location || !body.country) {
      return NextResponse.json(
        { error: "Missing required fields: name, location, or country" }, 
        { status: 400 }
      );
    }

    // ২. স্লাগ জেনারেট (যদি ফ্রন্টএন্ড না পাঠায়)
    let slug = body.slug;
    if (!slug) {
      slug = createSlug(body.name);
    }

    // ৩. ডাটা প্রিপারেশন
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
    
    // ৪. ডুপ্লিকেট এরর হ্যান্ডলিং
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