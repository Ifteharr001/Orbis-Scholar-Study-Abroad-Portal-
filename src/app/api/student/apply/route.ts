import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import University from "@/models/University"; // ✅ GET রিকোয়েস্টের জন্য এটি লাগবে
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ✅ 1. GET Method: ইনটেক এবং ডেডলাইন পাওয়ার জন্য
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    // ফ্রন্টএন্ড থেকে পাঠানো প্যারামিটার রিসিভ করা
    const universityName = searchParams.get("universityName") || searchParams.get("university");
    const programName = searchParams.get("programName") || searchParams.get("program");

    if (!universityName || !programName) {
      return NextResponse.json(
        { success: false, message: "University and Program names are required" },
        { status: 400 }
      );
    }

    await connect();

    // ১. নির্দিষ্ট ইউনিভার্সিটি খুঁজে বের করা
    const university = await University.findOne(
      { name: universityName },
      { programs: 1, name: 1 } // শুধু programs অ্যারে এবং নাম দরকার
    );

    if (!university) {
      return NextResponse.json(
        { success: false, message: "University not found" },
        { status: 404 }
      );
    }

    // ২. নির্দিষ্ট প্রোগ্রামটি খুঁজে বের করা
   
    const targetProgram = university.programs?.find(
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.name.toLowerCase() === programName.toLowerCase()
    );

    if (!targetProgram) {
      return NextResponse.json(
        { success: false, message: "Program not found in this university" },
        { status: 404 }
      );
    }

    // ৩. ইনটেকস এবং ডেডলাইন রিটার্ন করা
    const intakes = targetProgram.intakes && targetProgram.intakes.length > 0 
      ? targetProgram.intakes 
      : ["September 2024", "March 2025"]; // Fallback defaults

    return NextResponse.json({
      success: true,
      intakes: intakes,
      deadline: targetProgram.deadline
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching intakes:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ 2. POST Method: অ্যাপ্লাই সাবমিট করার জন্য
export async function POST(req: Request) {
  try {
    // ১. সিকিউরিটি চেক: ইউজার লগইন করা আছে কিনা?
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized: Please login first" },
        { status: 401 }
      );
    }

    await connect();

    const body = await req.json();
    
    // ডাটা ডিসট্রাকচারিং
    const { 
      firstName, 
      lastName, 
      email, // ফর্ম থেকে আসা ইমেইল (যোগাযোগের জন্য)
      phone, 
      gender, 
      country, 
      address, 
      programName, 
      universityName, 
      intakePreference 
    } = body;

    // ২. ভ্যালিডেশন
    if (!universityName || !programName || !intakePreference) {
      return NextResponse.json(
        { message: "Missing required fields (University, Program or Intake)" },
        { status: 400 }
      );
    }

    // ৩. ডুপ্লিকেট চেক: একই স্টুডেন্ট একই প্রোগ্রামে আগে অ্যাপ্লাই করেছে কিনা?
    const existingApplication = await Application.findOne({
      studentEmail: session.user.email, // লগইন করা ইমেইল দিয়ে চেক হবে
      universityName: universityName,
      programName: programName,
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied to this program." },
        { status: 409 } // 409 Conflict
      );
    }

    // ৪. ইউনিক অ্যাপ্লিকেশন আইডি তৈরি
    const uniqueId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // ৫. নতুন অ্যাপ্লিকেশন তৈরি
    const newApplication = new Application({
      applicationId: uniqueId,
      
      // ইউজার আইডেন্টিফিকেশন (লগইন করা ইমেইল)
      studentEmail: session.user.email, 
      
      // ফর্মে দেওয়া পার্সোনাল ডাটা
      contactEmail: email,
      firstName,
      lastName,
      phone,
      gender,
      country,
      address,
      
      // প্রোগ্রামের ডিটেইলস
      programName,
      universityName,
      intakePreference,
      
      // স্ট্যাটাস
      status: "Applied",
      appliedDate: new Date(),
    });

    await newApplication.save();

    return NextResponse.json(
      { message: "Application submitted successfully", success: true },
      { status: 201 }
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Application Error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}