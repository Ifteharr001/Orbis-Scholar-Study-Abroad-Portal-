import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import Student from "@/models/Student";
import Document from "@/models/Document";
import Task from "@/models/Task";
import University from "@/models/University";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, props: Props) {
  try {
    const params = await props.params;
    await connect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-it");
    const { payload } = await jwtVerify(token, secret);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const counselorId = (payload as any).id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const application: any = await Application.findById(params.id)
      .populate({ path: "universityId", model: University, select: "name programName" })
      .lean();

    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const student = await Student.findOne({ email: application.studentEmail }).lean();
    
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    if (String(student.counselor) !== String(counselorId)) {
        return NextResponse.json({ error: "Access Denied: This student is not assigned to you." }, { status: 403 });
    }

    const documents = await Document.find({
        $or: [
            { applicationId: params.id },
            { studentEmail: application.studentEmail }
        ]
    }).sort({ uploadedAt: -1 }).lean();

    const tasks = await Task.find({ assignedTo: application.studentEmail }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      application: {
        ...application,
        universityName: application.universityId?.name || application.universityName,
        programName: application.universityId?.programName || application.programName,
        studentId: student._id,
        studentName: student.name,
        studentPhone: student.phone,
        internalNotes: application.internalNotes || []
      },
      documents,
      tasks
    });

  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Counselor App Details Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, props: Props) {
    try {
        const params = await props.params;
        const body = await req.json();
        const { action } = body;
        await connect();

        if (action === "update_document_status") {
            const { documentId, status, feedback } = body;
            await Document.findByIdAndUpdate(documentId, { status, feedback });
            return NextResponse.json({ success: true, message: "Document updated" });
        }

        if (action === "update_status") {
            const { status } = body;
            await Application.findByIdAndUpdate(params.id, { status });
            return NextResponse.json({ success: true, message: "Status updated" });
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
                author: "Counselor" 
            });

            app.internalNotes = currentNotes;
            app.markModified("internalNotes");
            
            await app.save();

            return NextResponse.json({ success: true, message: "Note added" });
        }

        return NextResponse.json({ success: true });

    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request, props: Props) {
    try {
        const params = await props.params;
        const body = await req.json();
        const { action } = body;
        await connect();

        if (action === "request_document") {
            const { documentName, studentEmail, message, deadline } = body;
            await Document.create({
                applicationId: params.id,
                studentEmail,
                name: documentName,
                status: "Pending",
                feedback: message + (deadline ? ` (Due: ${deadline})` : "")
            });
            return NextResponse.json({ success: true, message: "Request sent" });
        }

        if (action === "create_task") {
            const { title, priority, dueDate, studentEmail } = body;
            await Task.create({
                title, priority, dueDate,
                assignedTo: studentEmail,
                assignedBy: "counselor",
                status: "Pending"
            });
            return NextResponse.json({ success: true, message: "Task assigned" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}