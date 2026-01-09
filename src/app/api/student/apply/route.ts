import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    
    // ডাটা ডিসট্রাকচারিং (email বডি থেকে নেব না, সেশন থেকে নেব)
    const { 
      firstName, 
      lastName, 
      phone, 
      gender, 
      country, 
      address, 
      programName, 
      universityName, 
      intakePreference 
    } = body;

    // ২. ভ্যালিডেশন
    if (!universityName || !programName) {
      return NextResponse.json(
        { message: "Missing required fields (University or Program)" },
        { status: 400 }
      );
    }

    // ৩. ডুপ্লিকেট চেক: একই স্টুডেন্ট কি একই প্রোগ্রামে আগে অ্যাপ্লাই করেছে?
    const existingApplication = await Application.findOne({
      studentEmail: session.user.email,
      universityName: universityName,
      programName: programName,
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied to this program." },
        { status: 409 } // 409 Conflict
      );
    }

    // ৪. সেইফ অ্যাপ্লিকেশন আইডি তৈরি (Date + Random Number)
    // শুধু Date.now() দিলে একই মিলিসেকেন্ডে দুইজন অ্যাপ্লাই করলে আইডি মিলে যেতে পারে
    const uniqueId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // ৫. নতুন অ্যাপ্লিকেশন তৈরি
    const newApplication = new Application({
      studentEmail: session.user.email, // 🔒 সেশন থেকে নেওয়া ইমেইল (সিকিউর)
      firstName,
      lastName,
      phone,
      gender,
      country,
      address,
      programName,
      universityName,
      intakePreference,
      status: "Applied",
      appliedDate: new Date(),
      applicationId: uniqueId,
    });

    await newApplication.save();

    return NextResponse.json(
      { message: "Application submitted successfully", success: true },
      { status: 201 }
    );

  } catch (error: unknown) { // টাইপ সেফটি
    console.error("Application Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { message: "Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}