import { NextResponse } from "next/server";
import { connect } from "@/lib/db"; 
import Application from "@/models/Application"; 
export async function POST(req: Request) {
  try {
    await connect(); 

    const body = await req.json();
    
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      gender, 
      country, 
      address, 
      programName, 
      universityName, 
      intakePreference 
    } = body;

    if (!email || !universityName || !programName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // নতুন অ্যাপ্লিকেশন তৈরি
    const newApplication = new Application({
      studentEmail: email, // ফ্রন্টএন্ডের 'email' মডেলে 'studentEmail' হিসেবে যাবে
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
      applicationId: `APP-${Date.now()}`, // একটি ইউনিক আইডি জেনারেট করা হলো
    });

    await newApplication.save();

    return NextResponse.json(
      { message: "Application submitted successfully", success: true },
      { status: 201 }
    );

  } 



catch (error) {
    console.error("Application Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { message: "Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}