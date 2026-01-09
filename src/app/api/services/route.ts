import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Service from "@/models/Service";

// স্লাগ জেনারেটর ফাংশন
function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") 
    .replace(/[\s_-]+/g, "-") 
    .replace(/^-+|-+$/g, ""); 
}

export async function GET() {
  try {
    await connect();
    const services = await Service.find({})
      .sort({ createdAt: -1 })
      .select("title slug icon description") 
      .lean();

    return NextResponse.json(services);
  } catch (error) {
    console.error("Fetch Services Error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();

    if (!body.title || !body.description || !body.icon) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let slug = body.slug;
    if (!slug) {
      slug = createSlug(body.title);
    }

    const serviceData = {
        ...body,
        slug 
    };

    const newService = await Service.create(serviceData);
    
    return NextResponse.json(newService, { status: 201 });

  } catch (error: unknown) { // ✅ পরিবর্তন ১: 'any' এর বদলে 'unknown' দেওয়া হলো
    console.error("Error creating service:", error); 
    
    // ✅ পরিবর্তন ২: টাইপ কাস্টিং (Type Casting)
    // আমরা এরর টাকে এমন একটা অবজেক্ট হিসেবে ধরছি যার 'code' এবং 'message' আছে
    const err = error as { code?: number; message?: string };

    // MongoDB Duplicate Key Error (code 11000)
    if (err.code === 11000) {
        return NextResponse.json(
            { error: "A service with this title already exists. Please use a unique title." }, 
            { status: 409 }
        );
    }

    return NextResponse.json({ error: err.message || "Failed to create service" }, { status: 500 });
  }
}