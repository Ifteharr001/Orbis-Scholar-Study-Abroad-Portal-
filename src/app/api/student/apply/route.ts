import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import University from "@/models/University"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const universityName = searchParams.get("universityName") || searchParams.get("university");
    const programName = searchParams.get("programName") || searchParams.get("program");

    if (!universityName || !programName) {
      return NextResponse.json(
        { success: false, message: "University and Program names are required" },
        { status: 400 }
      );
    }

    await connect();

    const university = await University.findOne(
      { name: universityName },
      { programs: 1, name: 1 }
    );

    if (!university) {
      return NextResponse.json(
        { success: false, message: "University not found" },
        { status: 404 }
      );
    }

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

    const intakes = targetProgram.intakes && targetProgram.intakes.length > 0 
      ? targetProgram.intakes 
      : ["September 2024", "March 2025"]; 

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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized: Please login first" },
        { status: 401 }
      );
    }

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

    if (!universityName || !programName || !intakePreference) {
      return NextResponse.json(
        { message: "Missing required fields (University, Program or Intake)" },
        { status: 400 }
      );
    }

    const existingApplication = await Application.findOne({
      studentEmail: session.user.email,
      universityName: universityName,
      programName: programName,
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You have already applied to this program." },
        { status: 409 } 
      );
    }

    const uniqueId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newApplication = new Application({
      applicationId: uniqueId,
      
      studentEmail: session.user.email, 
      
      contactEmail: email,
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