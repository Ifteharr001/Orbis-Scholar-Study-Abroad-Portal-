import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import Student from "@/models/Student";
import Document from "@/models/Document";
import University from "@/models/University";
import Task from "@/models/Task";
import User from "@/models/User"; 

type Props = {
  params: Promise<{ id: string }>;
};

// GET Method
export async function GET(req: Request, props: Props) {
  try {
    const params = await props.params;
    await connect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const application: any = await Application.findById(params.id)
      .populate({
        path: "universityId",
        model: University,
        select: "name programName"
      })
      .lean();

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const student = await User.findOne({ email: application.studentEmail })
        .populate("counselor", "name email phone image country") 
        .lean();

    if (student && student.counselor) {
        application.counselor = student.counselor;
    } else {
        application.counselor = null; 
    }

    const documents = await Document.find({
      $or: [
        { applicationId: params.id },
        { studentEmail: application.studentEmail }
      ]
    }).sort({ uploadedAt: -1 }).lean();

    const tasks = await Task.find({ 
      assignedTo: application.studentEmail 
    }).sort({ createdAt: -1 }).lean();

    const formattedData = {
      application: {
        ...application,
        universityName: application.universityId?.name || "Unknown University",
        programName: application.universityId?.programName || application.programName,
        studentId: student?._id, 
        studentName: student?.name || application.firstName + " " + application.lastName,
        studentEmail: application.studentEmail,
        
      },
      student: student, 
      documents: documents,
      tasks: tasks
    };

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// PATCH Method
export async function PATCH(req: Request, props: Props) {
  try {
    const params = await props.params;
    const body = await req.json();
    const { status } = body; 

    if (!status) {
        return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    await connect();

    const updatedApp = await Application.findByIdAndUpdate(
        params.id,
        { status },
        { new: true }
    );

    if (!updatedApp) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedApp });

  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

// POST Method (এখানেই আপনার ভুল ছিল)
export async function POST(req: Request, props: Props) {
  try {
    const params = await props.params;
    const body = await req.json();
    const { action } = body;

    await connect();

    if (action === "request_document") {
      const { documentName, studentEmail, message, deadline } = body;

      if (!studentEmail) {
        return NextResponse.json({ error: "Student email required" }, { status: 400 });
      }

      await Document.create({
        applicationId: params.id,
        studentEmail: studentEmail,
        name: documentName,
        fileName: "Pending Upload",
        fileUrl: "#",
        status: "Pending",
        category: "required",
        feedback: message + (deadline ? ` (Deadline: ${deadline})` : "")
      });

      return NextResponse.json({ success: true, message: "Request created successfully" });
    }

    if (action === "create_task") {
      const { title, priority, dueDate, studentEmail } = body;

      
      const newTask = await Task.create({
        title,
        status: "Pending",
        priority: priority || "Medium",
        dueDate: dueDate,
        assignedTo: studentEmail,
        assignedBy: "admin",
        description: `Assigned via Application #${params.id}`
      } as any); 

      return NextResponse.json({ success: true, data: newTask });
    }

    return NextResponse.json({ error: "Invalid Action" }, { status: 400 });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Operation Failed" }, { status: 500 });
  }
}

// PUT Method
export async function PUT(req: Request, props: Props) {
    try {
      const params = await props.params;
      const body = await req.json();
      const { action } = body;
      await connect();
  
      if (action === "update_document_status") {
        const { documentId, status, feedback } = body;
        const updatedDoc = await Document.findByIdAndUpdate(documentId, { status, feedback }, { new: true });
        return NextResponse.json({ success: true, data: updatedDoc });
      }
      
      if (action === "update_notes") {
        const { notes } = body;
        
        const app = await Application.findById(params.id);
        
        if (!app) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        let currentNotes = app.internalNotes;

        if (!Array.isArray(currentNotes)) {
            currentNotes = [];
        }

        currentNotes.push({
            content: notes,
            createdAt: new Date(),
            author: "Admin"
        });

        app.internalNotes = currentNotes;
        app.markModified("internalNotes"); 

        await app.save();

        return NextResponse.json({ success: true, message: "Note added successfully" });
      }

      return NextResponse.json({ success: true });
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) { 
      console.error("PUT Error:", error);
      return NextResponse.json({ error: "Update Failed", details: error.message }, { status: 500 });
    }
}