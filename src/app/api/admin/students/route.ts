import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Application from "@/models/Application";
import Segment from "@/models/Segment"; 
import bcrypt from "bcryptjs";

// ✅ 1. GET Method: Fixed Filtering Logic with $and
export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const segmentId = searchParams.get("segment");
    
    // ✅ Fix: Initialize an array for $and conditions
    // This ensures that ALL conditions (Role + Search + Segment Filters) must be met.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const andConditions: any[] = [
      { role: "student" } // Default condition: User must be a student
    ];

    // 1. Text Search (Name or Email)
    if (query) {
      andConditions.push({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ]
      });
    }

    // 2. ✅ Segment Filtering (Logic using $and)
    if (segmentId) {
      const segment = await Segment.findById(segmentId);
      
      if (segment && segment.conditions && segment.conditions.length > 0) {
        
        console.log("Applying Conditions:", segment.conditions);

        segment.conditions.forEach((condition: string) => {
          const lowerCond = condition.toLowerCase(); 
          const parts = condition.split("="); // Split by equals sign
          
          if (parts.length > 1) {
            const val = parts[1].trim(); // Get value (e.g., MSc, India)

            // 🔹 Status Filter
            if (lowerCond.includes("status")) {
              andConditions.push({ status: val.toLowerCase() });
            }

            // 🔹 Country Filter
            if (lowerCond.includes("country")) {
              andConditions.push({ country: { $regex: val, $options: "i" } });
            }

            // 🔹 Program Filter (Fix: Validates actual value)
            if (lowerCond.includes("program")) {
              andConditions.push({
                $or: [
                  { programPreference: { $regex: val, $options: "i" } }, // Check string field
                  { "programPreference.degree": { $regex: val, $options: "i" } } // Check object field
                ]
              });
            }

            // 🔹 Intake Filter
            if (lowerCond.includes("intake")) {
               andConditions.push({
                 $or: [
                   { intakePreference: { $regex: val, $options: "i" } },
                   { notes: { $regex: val, $options: "i" } }
                 ]
               });
            }

            // 🔹 Counselor Filter
            if (lowerCond.includes("counselor")) {
               andConditions.push({
                 $or: [
                   { counselor: { $regex: val, $options: "i" } },
                   { notes: { $regex: val, $options: "i" } }
                 ]
               });
            }
            
            // 🔹 Gender Filter
            if (lowerCond.includes("gender")) {
               andConditions.push({ gender: { $regex: `^${val}$`, $options: "i" } });
            }
          }
        });
      }
    }

    // 3. Execute Query with $and
    // If andConditions only has { role: "student" }, it returns all students.
    // If filters are added, it returns only students matching ALL criteria.
    const students = await User.find({ $and: andConditions })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // 4. Merge Application Data
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

// ✅ 2. POST Method (Unchanged)
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