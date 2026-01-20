export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import Document from "@/models/Document";
import User from "@/models/User";
import Message from "@/models/Message"; 

const REQUIRED_DEFAULTS = ["Academic Transcript", "Passport Copy"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const email = session.user.email;

    const [studentResult, applications, uploadedDocs] = await Promise.all([
      User.findOne({ email }).populate("counselor").lean(),
      
      Application.find({ studentEmail: email })
        .select("universityName programName status appliedDate applicationId")
        .sort({ appliedDate: -1 })
        .lean(),

      Document.find({ studentEmail: email })
        .select("name status category fileName feedback uploadedAt")
        .lean()
    ]);

    // Counselor Data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const student: any = studentResult;
    const counselor = student?.counselor ? {
        name: student.counselor.name,
        email: student.counselor.email,
        phone: student.counselor.phone,
        image: student.counselor.image || "",
    } : null;

    let unreadMessagesCount = 0;
    if (student) {
        unreadMessagesCount = await Message.countDocuments({
            receiver: student._id,
            isRead: false
        });
    }

    // --- Document Stats Calculation ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadedDocNames = uploadedDocs.map((d: any) => d.name);
    const missingDocsCount = REQUIRED_DEFAULTS.filter(name => !uploadedDocNames.includes(name)).length;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actionRequiredDocsCount = uploadedDocs.filter((d: any) => 
      d.status === "Rejected" || (d.status === "Pending" && d.fileName === "Pending Upload")
    ).length;

    const totalPendingDocs = missingDocsCount + actionRequiredDocsCount;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verifiedDocsCount = uploadedDocs.filter((d: any) => d.status === "Verified").length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rejectedDocsCount = uploadedDocs.filter((d: any) => d.status === "Rejected").length;

    // Offer Stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offersCount = applications.filter((app: any) => 
      app.status === "Offer Received" || app.status === "Conditional Offer" || app.status === "Approved"
    ).length;

    // Final Stats Object
    const stats = {
      applications: applications.length,
      pendingDocs: totalPendingDocs,
      offers: offersCount,
      unreadMessages: unreadMessagesCount, 
      verifiedDocs: verifiedDocsCount,
      rejectedDocs: rejectedDocsCount
    };

    // --- Actions / Notifications ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actions: any[] = [];

    // Rejected Notification
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rejectedDocs = uploadedDocs.filter((d: any) => d.status === "Rejected");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rejectedDocs.forEach((doc: any) => {
        actions.push({
            _id: doc._id,
            message: `Document Rejected: ${doc.name}. Please re-upload.`,
            type: "urgent",
            createdAt: doc.uploadedAt || new Date().toISOString(),
            link: "/student/documents"
        });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestedDocs = uploadedDocs.filter((d: any) => d.status === "Pending" && d.fileName === "Pending Upload");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestedDocs.forEach((doc: any) => {
        actions.push({
            _id: doc._id,
            message: `Action Required: Please upload your ${doc.name}.`,
            type: "alert",
            createdAt: doc.uploadedAt || new Date().toISOString(),
            link: "/student/documents"
        });
    });

    // Missing Docs Alert
    if (missingDocsCount > 0) {
        actions.push({
            _id: "missing-docs-alert",
            message: `You are missing ${missingDocsCount} required documents. Please upload them.`,
            type: "info",
            createdAt: new Date().toISOString(),
            link: "/student/documents"
        });
    }

    // Offer Alert
    if (offersCount > 0) {
      actions.push({
        _id: "offer-alert",
        message: "Congratulations! You have received an offer letter.",
        type: "success",
        createdAt: new Date().toISOString(),
        link: "/student/applications"
      });
    }

    // Counselor Alert
    if (!counselor) {
        actions.push({
            _id: "counselor-pending",
            message: "Your profile is being reviewed for counselor assignment.",
            type: "info",
            createdAt: new Date().toISOString()
        });
    }

    actions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      stats,
      applications,
      actions,
      counselor
    });

  } catch (error) {
    console.error("Dashboard Data Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}