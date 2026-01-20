import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Segment from "@/models/Segment";
import User from "@/models/User"; 

// GET: সব সেগমেন্ট এবং স্টুডেন্ট কাউন্ট নিয়ে আসা
export async function GET() {
  try {
    await connect();
    
    const segments = await Segment.find().sort({ createdAt: -1 }).lean();

    const enrichedSegments = await Promise.all(segments.map(async (seg) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: any = { role: "student" };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const andConditions: any[] = [{ role: "student" }];

        if (seg.conditions && seg.conditions.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            seg.conditions.forEach((condition: any) => {
                const lowerCond = condition.toLowerCase();
                const parts = condition.split("=");
                
                if (parts.length > 1) {
                    const val = parts[1].trim();

                    if (lowerCond.includes("status")) {
                        andConditions.push({ status: val.toLowerCase() });
                    }
                    if (lowerCond.includes("country")) {
                        andConditions.push({ country: { $regex: val, $options: "i" } });
                    }
                    if (lowerCond.includes("program")) {
                        andConditions.push({
                            $or: [
                                { programPreference: { $regex: val, $options: "i" } },
                                { "programPreference.degree": { $regex: val, $options: "i" } }
                            ]
                        });
                    }
                    if (lowerCond.includes("intake")) {
                        andConditions.push({
                            $or: [
                                { intakePreference: { $regex: val, $options: "i" } },
                                { notes: { $regex: val, $options: "i" } }
                            ]
                        });
                    }
                    if (lowerCond.includes("counselor")) {
                        andConditions.push({
                            $or: [
                                { counselor: { $regex: val, $options: "i" } },
                                { notes: { $regex: val, $options: "i" } }
                            ]
                        });
                    }
                    // Gender added
                    if (lowerCond.includes("gender")) {
                        andConditions.push({ gender: { $regex: `^${val}$`, $options: "i" } });
                    }
                }
            });
        }

        // Fix: Use $and logic for accurate counting
        const count = await User.countDocuments(andConditions.length > 0 ? { $and: andConditions } : filter);
        return { ...seg, studentCount: count }; 
    }));

    return NextResponse.json({ segments: enrichedSegments });
  } catch (error) {
    console.error("Fetch Segments Error:", error);
    return NextResponse.json({ message: "Error fetching segments", segments: [] }, { status: 500 });
  }
}

// POST: নতুন সেগমেন্ট তৈরি
export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();
    const newSegment = await Segment.create(body);
    return NextResponse.json({ segment: newSegment }, { status: 201 });
  } catch (error) {
    console.error("Create Segment Error:", error);
    return NextResponse.json({ message: "Error creating segment" }, { status: 500 });
  }
}

// ✅ DELETE: সেগমেন্ট ডিলিট করার মেথড (নতুন যোগ করা হয়েছে)
export async function DELETE(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Segment ID is required" }, { status: 400 });
    }

    await Segment.findByIdAndDelete(id);

    return NextResponse.json({ message: "Segment deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Segment Error:", error);
    return NextResponse.json({ message: "Error deleting segment" }, { status: 500 });
  }
}