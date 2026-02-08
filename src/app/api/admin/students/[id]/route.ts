import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Application from "@/models/Application";
import Documents from "@/models/Document"; 

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
    }

    const student = await User.findById(id)
        .select("-password")
        .populate("counselor", "name email phone image country"); 

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const [applications, documents] = await Promise.all([
      Application.find({ studentEmail: student.email }).sort({ createdAt: -1 }),
      Documents.find({ studentEmail: student.email }).sort({ uploadedAt: -1 })
    ]);

    return NextResponse.json({ 
      student, 
      applications,
      documents 
    });

  } catch (error) {
    console.error("API Error (GET):", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const body = await req.json();

    const { 
        action, 
        counselorId,
        name, phone, country, city, address, 
        dob, status, counselor, notes, 
        programPreference 
    } = body;

    let finalCounselorId = counselor;
    
    if (action === "assign_counselor") {
        finalCounselorId = counselorId;
    }

    const validCounselor = (finalCounselorId && finalCounselorId.trim() !== "") ? finalCounselorId : null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (action === "assign_counselor") {
        updateData.counselor = validCounselor;
    } else {
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (country) updateData.country = country;
        if (city) updateData.city = city;
        if (address) updateData.address = address;
        if (dob) updateData.dob = dob;
        if (status) updateData.status = status;
        if (programPreference) updateData.programPreference = programPreference;
        if (notes) updateData.notes = notes;
        
        if (counselor !== undefined) updateData.counselor = validCounselor;
    }

    const updatedStudent = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("counselor", "name email image"); 

    if (!updatedStudent) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ 
        message: "Student updated successfully", 
        student: updatedStudent 
    });

  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
   catch (error: any) {
    console.error("API Error (PUT):", error);
    return NextResponse.json({ 
        message: error.message || "Error updating student" 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;

    const deletedStudent = await User.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Student deleted successfully" });

  } catch (error) {
    console.error("API Error (DELETE):", error);
    return NextResponse.json({ message: "Error deleting student" }, { status: 500 });
  }
}