import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partnerId = (session.user as any).id || (session.user as any).partnerId;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "all";
    const status = searchParams.get("status") || "all";
    const student = searchParams.get("student") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Replace with actual database queries
    // const query: any = { partnerId };
    // if (search) query.$or = [{ studentName: { $regex: search, $options: "i" } }, { documentName: { $regex: search, $options: "i" } }];
    // if (type !== "all") query.type = type;
    // if (status !== "all") query.status = status;
    // if (student !== "all") query.studentId = student;
    // const total = await Document.countDocuments(query);
    // const documents = await Document.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    // const totalPages = Math.ceil(total / limit);

    // Mock data for now
    const mockDocuments = [
      { _id: "1", documentId: "DOC-2024-001", studentName: "Sarah Johnson", studentId: "STU-2024-001", studentEmail: "sarah.johnson@email.com", documentName: "Academic Transcript", type: "transcript", status: "Verified", university: "University of Toronto", program: "MSc Computer Science", uploadedAt: new Date("2024-01-10").toISOString(), verifiedAt: new Date("2024-01-12").toISOString(), size: "2.4 MB" },
      { _id: "2", documentId: "DOC-2024-002", studentName: "Sarah Johnson", studentId: "STU-2024-001", studentEmail: "sarah.johnson@email.com", documentName: "IELTS Score Report", type: "language_test", status: "Verified", university: "University of Toronto", program: "MSc Computer Science", uploadedAt: new Date("2024-01-11").toISOString(), verifiedAt: new Date("2024-01-13").toISOString(), size: "1.1 MB" },
      { _id: "3", documentId: "DOC-2024-003", studentName: "Michael Chen", studentId: "STU-2024-002", studentEmail: "michael.chen@email.com", documentName: "Passport Copy", type: "passport", status: "Verified", university: "McGill University", program: "MBA", uploadedAt: new Date("2024-01-12").toISOString(), verifiedAt: new Date("2024-01-14").toISOString(), size: "856 KB" },
      { _id: "4", documentId: "DOC-2024-004", studentName: "Michael Chen", studentId: "STU-2024-002", studentEmail: "michael.chen@email.com", documentName: "Bank Statement", type: "financial", status: "Pending", university: "McGill University", program: "MBA", uploadedAt: new Date("2024-01-13").toISOString(), verifiedAt: null, size: "3.2 MB" },
      { _id: "5", documentId: "DOC-2024-005", studentName: "Emily Rodriguez", studentId: "STU-2024-003", studentEmail: "emily.rodriguez@email.com", documentName: "Recommendation Letter 1", type: "recommendation", status: "Verified", university: "University of British Columbia", program: "BSc Nursing", uploadedAt: new Date("2024-01-08").toISOString(), verifiedAt: new Date("2024-01-10").toISOString(), size: "512 KB" },
      { _id: "6", documentId: "DOC-2024-006", studentName: "Emily Rodriguez", studentId: "STU-2024-003", studentEmail: "emily.rodriguez@email.com", documentName: "CV/Resume", type: "cv", status: "Verified", university: "University of British Columbia", program: "BSc Nursing", uploadedAt: new Date("2024-01-09").toISOString(), verifiedAt: new Date("2024-01-11").toISOString(), size: "1.8 MB" },
      { _id: "7", documentId: "DOC-2024-007", studentName: "David Kim", studentId: "STU-2024-004", studentEmail: "david.kim@email.com", documentName: "Academic Transcript", type: "transcript", status: "Rejected", university: "University of Alberta", program: "MEng Electrical", uploadedAt: new Date("2024-01-14").toISOString(), verifiedAt: new Date("2024-01-15").toISOString(), size: "2.1 MB" },
      { _id: "8", documentId: "DOC-2024-008", studentName: "Lisa Thompson", studentId: "STU-2024-005", studentEmail: "lisa.thompson@email.com", documentName: "GRE Score Report", type: "language_test", status: "Pending", university: "Western University", program: "MSc Data Science", uploadedAt: new Date("2024-01-15").toISOString(), verifiedAt: null, size: "1.5 MB" },
    ];

    // Filter mock data based on search params
    let filtered = mockDocuments;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(d =>
        d.studentName.toLowerCase().includes(searchLower) ||
        d.documentName.toLowerCase().includes(searchLower) ||
        d.documentId.toLowerCase().includes(searchLower)
      );
    }
    if (type !== "all") {
      filtered = filtered.filter(d => d.type === type);
    }
    if (status !== "all") {
      filtered = filtered.filter(d => d.status.toLowerCase() === status.toLowerCase());
    }
    if (student !== "all") {
      filtered = filtered.filter(d => d.studentId === student);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      documents: paginated,
      total,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error("Partner Documents API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}