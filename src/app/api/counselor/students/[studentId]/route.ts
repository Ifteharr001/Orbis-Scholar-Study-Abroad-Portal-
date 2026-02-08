import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User"; // ⚠️ Student এর বদলে User মডেল
import Application from "@/models/Application"; 
import { getToken } from "next-auth/jwt"; 
import { NextRequest } from "next/server";

type Props = {
  params: Promise<{ studentId: string }>;
};

export async function GET(
  request: NextRequest,
  props: Props 
) {
  try {
    const params = await props.params;
    const { studentId } = params;

    await connect();

    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req: request, secret });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const counselorId = token.id || token.sub; 

    const student = await User.findOne({ 
        _id: studentId, 
        counselor: counselorId,
        role: "student"
    }).select("-password").lean();

    if (!student) {
      return NextResponse.json({ error: "Student not found or access denied" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let applications: any[] = []; 

    try {
        applications = await Application.find({ 
            $or: [
                { studentId: student._id }, 
                { studentEmail: student.email }
            ]
        }).sort({ createdAt: -1 }).lean();
    } catch (err) {
        console.log("Application fetch error:", err);
        applications = [];
    }

    return NextResponse.json({
      success: true,
      student: student,
      applications: applications
    });

  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
   catch (error: any) {
    console.error("Single Student API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}