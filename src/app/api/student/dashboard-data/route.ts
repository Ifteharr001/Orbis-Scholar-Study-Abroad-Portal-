export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import Document from "@/models/Document";
import User from "@/models/User";

const REQUIRED_DEFAULTS = ["Academic Transcript", "Passport Copy"];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const email = session.user.email;

    // 🔥 অপটিমাইজেশন: Promise.all ব্যবহার করে ৩টি কুয়েরি একসাথে রান করা হচ্ছে
    const [studentResult, applications, uploadedDocs] = await Promise.all([
      // ১. স্টুডেন্ট ডাটা (কাউন্সিলর সহ)
      User.findOne({ email }).populate("counselor").lean(),
      
      // ২. অ্যাপ্লিকেশন ডাটা
      Application.find({ studentEmail: email })
        .select("universityName programName status appliedDate applicationId")
        .sort({ appliedDate: -1 })
        .lean(),

      // ৩. ডকুমেন্ট ডাটা
      Document.find({ studentEmail: email })
        .select("name status category")
        .lean()
    ]);

    // কাউন্সিলর ডাটা প্রসেস করা
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const student: any = studentResult;
    const counselor = student?.counselor ? {
        name: student.counselor.name,
        email: student.counselor.email,
        phone: student.counselor.phone,
        image: student.counselor.image || "",
    } : null;

    // ডকুমেন্ট প্রসেস করা
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadedDocNames = uploadedDocs.map((d: any) => d.name);
    const missingDocsCount = REQUIRED_DEFAULTS.filter(name => !uploadedDocNames.includes(name)).length;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actionRequiredDocsCount = uploadedDocs.filter((d: any) => 
      d.status === "Rejected" || d.status === "Pending"
    ).length;

    const totalPendingDocs = missingDocsCount + actionRequiredDocsCount;

    // অফার প্রসেস করা
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offersCount = applications.filter((app: any) => 
      app.status === "Offer Received" || app.status === "Conditional Offer" || app.status === "Approved"
    ).length;

    // স্ট্যাটস তৈরি
    const stats = {
      applications: applications.length,
      pendingDocs: totalPendingDocs,
      offers: offersCount,
      unreadMessages: 0, 
    };

    // ডায়নামিক অ্যাকশনস
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actions: any[] = [];
    
    if (totalPendingDocs > 0) {
      actions.push({
        _id: "act-1",
        message: `You have ${totalPendingDocs} pending documents to upload/fix.`,
        type: "urgent",
        createdAt: new Date().toISOString()
      });
    }
    
    if (offersCount > 0) {
      actions.push({
        _id: "act-2",
        message: "Congratulations! You have received an offer.",
        type: "success",
        createdAt: new Date().toISOString()
      });
    }

    if (!counselor) {
        actions.push({
            _id: "act-3",
            message: "Your profile is under review for counselor assignment.",
            type: "info",
            createdAt: new Date().toISOString()
        });
    }

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