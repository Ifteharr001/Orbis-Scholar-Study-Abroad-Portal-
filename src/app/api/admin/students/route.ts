import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Application from "@/models/Application";
import Segment from "@/models/Segment"; 
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const segmentId = searchParams.get("segment");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const andConditions: any[] = [
      { role: "student" }
    ];

    if (query) {
      andConditions.push({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ]
      });
    }

    if (segmentId) {
      const segment = await Segment.findById(segmentId);
      
      if (segment && segment.conditions && segment.conditions.length > 0) {
        
        console.log("Applying Conditions:", segment.conditions);

        segment.conditions.forEach((condition: string) => {
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
            
            if (lowerCond.includes("gender")) {
               andConditions.push({ gender: { $regex: `^${val}$`, $options: "i" } });
            }
          }
        });
      }
    }

    const students = await User.find({ $and: andConditions })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentEmails = students.map((s: any) => s.email);

    const applications = await Application.find({ 
      studentEmail: { $in: studentEmails } 
    }).select("studentEmail programName universityName");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentsWithApps = students.map((student: any) => {
      const studentApps = applications.filter(
        (app) => app.studentEmail === student.email
      );
      return { 
        ...student, 
        applications: studentApps 
      };
    });

    return NextResponse.json({ students: studentsWithApps });

  } catch (error) {
    console.error("Fetch Students Error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();

    const { 
      firstName, lastName, email, phone, country, gender, 
      dateOfBirth, programPreference, intakePreference, 
      counselor, address, notes 
    } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash("123456", 10);
    const combinedNotes = `Intake: ${intakePreference || "N/A"}, Counselor: ${counselor || "N/A"}. ${notes || ""}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentData: any = {
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: "student",
      phone,
      country,
      gender,
      dob: dateOfBirth,
      address,
      status: "active",
      programPreference: programPreference, 
      notes: combinedNotes 
    };

    const newStudent = await User.create(studentData);

    return NextResponse.json({ 
      message: "Student created successfully", 
      student: newStudent 
    }, { status: 201 });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Create Student Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}