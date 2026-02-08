import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const studentResult = await User.findOne({ email: session.user.email })
      .populate({
        path: "counselor", 
        select: "-password",
      })
      .lean();

    if (!studentResult) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const student: any = studentResult;
    const counselor = student.counselor;

    if (!counselor) {
      return NextResponse.json({ counselor: null });
    }

    const counselorData = {
      id: counselor._id.toString(),
      name: counselor.name,
      email: counselor.email,
      phone: counselor.phone || "Not provided",
      whatsapp: counselor.phone || "Not provided",
      image: counselor.image || "/placeholder.svg", 
      
      title: counselor.title || "Education Counselor",
      location: counselor.country || "Dhaka, Bangladesh",
      
      languages: Array.isArray(counselor.languages) && counselor.languages.length > 0 
        ? counselor.languages 
        : ["English", "Bangla"],
      
      specializations: Array.isArray(counselor.specializations) && counselor.specializations.length > 0
        ? counselor.specializations 
        : ["Study Abroad", "Visa Guidance"],

      // Stats
      rating: counselor.rating || 5.0,
      totalStudents: counselor.totalStudents || 120,
      successRate: counselor.successRate || 98,
      experience: counselor.experience || "3+ years",
      availability: counselor.availability || "Mon - Fri, 10 AM - 6 PM",
      bio: counselor.bio || "Professional counselor dedicated to guiding students towards their dream universities.",
    };

    return NextResponse.json({ counselor: counselorData });

  } catch (error) {
    console.error("Counselor Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}