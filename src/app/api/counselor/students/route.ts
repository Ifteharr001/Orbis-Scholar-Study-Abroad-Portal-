import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User"; 
import { getToken } from "next-auth/jwt"; 
import { NextRequest } from "next/server";
import mongoose from "mongoose"; 

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawId = token.id || token.sub; 
    
    console.log("🔍 Searching for Counselor ID (String):", rawId);

    let counselorObjectId;
    try {
        counselorObjectId = new mongoose.Types.ObjectId(rawId as string);
    } catch (e) {
        console.error("❌ Invalid ID format:", rawId);
    }
    const myStudents = await User.find({
        role: "student", 
        $or: [
            { counselor: rawId },            
            { counselor: counselorObjectId } 
        ]
    })
    .select("name email phone image createdAt notes counselor") 
    .sort({ createdAt: -1 })
    .lean();

    console.log(`Found ${myStudents.length} students assigned to you.`);

    return NextResponse.json({ 
        success: true, 
        students: myStudents 
    });

  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}