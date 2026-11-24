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
    const status = searchParams.get("status") || "all";
    const university = searchParams.get("university") || "all";
    const program = searchParams.get("program") || "all";
    const intake = searchParams.get("intake") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Replace with actual database queries
    // const query: any = { partnerId };
    // if (search) query.$or = [{ studentName: { $regex: search, $options: "i" } }, { applicationId: { $regex: search, $options: "i" } }, { university: { $regex: search, $options: "i" } }];
    // if (status !== "all") query.status = status;
    // if (university !== "all") query.university = university;
    // if (program !== "all") query.program = program;
    // if (intake !== "all") query.intake = intake;
    // const total = await Application.countDocuments(query);
    // const applications = await Application.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    // const totalPages = Math.ceil(total / limit);

    // Mock data for now
    const mockApplications = [
      { _id: "1", applicationId: "APP-2024-001", studentName: "Sarah Johnson", studentId: "STU-2024-001", studentEmail: "sarah.johnson@email.com", university: "University of Toronto", program: "MSc Computer Science", intake: "Fall 2024", status: "Submitted", submittedAt: new Date("2024-01-15").toISOString(), documentCount: 8, lastUpdated: new Date("2024-01-15").toISOString() },
      { _id: "2", applicationId: "APP-2024-002", studentName: "Michael Chen", studentId: "STU-2024-002", studentEmail: "michael.chen@email.com", university: "McGill University", program: "MBA", intake: "Fall 2024", status: "Under Review", submittedAt: new Date("2024-01-14").toISOString(), documentCount: 12, lastUpdated: new Date("2024-01-18").toISOString() },
      { _id: "3", applicationId: "APP-2024-003", studentName: "Emily Rodriguez", studentId: "STU-2024-003", studentEmail: "emily.rodriguez@email.com", university: "University of British Columbia", program: "BSc Nursing", intake: "Winter 2025", status: "Accepted", submittedAt: new Date("2024-01-13").toISOString(), documentCount: 15, lastUpdated: new Date("2024-01-20").toISOString() },
      { _id: "4", applicationId: "APP-2024-004", studentName: "David Kim", studentId: "STU-2024-004", studentEmail: "david.kim@email.com", university: "University of Alberta", program: "MEng Electrical", intake: "Fall 2024", status: "Documents Pending", submittedAt: new Date("2024-01-12").toISOString(), documentCount: 5, lastUpdated: new Date("2024-01-12").toISOString() },
      { _id: "5", applicationId: "APP-2024-005", studentName: "Lisa Thompson", studentId: "STU-2024-005", studentEmail: "lisa.thompson@email.com", university: "Western University", program: "MSc Data Science", intake: "Fall 2024", status: "Submitted", submittedAt: new Date("2024-01-11").toISOString(), documentCount: 10, lastUpdated: new Date("2024-01-11").toISOString() },
      { _id: "6", applicationId: "APP-2024-006", studentName: "James Wilson", studentId: "STU-2024-006", studentEmail: "james.wilson@email.com", university: "University of Waterloo", program: "MSc AI", intake: "Winter 2025", status: "Under Review", submittedAt: new Date("2024-01-10").toISOString(), documentCount: 7, lastUpdated: new Date("2024-01-15").toISOString() },
      { _id: "7", applicationId: "APP-2024-007", studentName: "Amanda Brown", studentId: "STU-2024-007", studentEmail: "amanda.brown@email.com", university: "Queen's University", program: "MBA", intake: "Fall 2024", status: "Accepted", submittedAt: new Date("2024-01-09").toISOString(), documentCount: 11, lastUpdated: new Date("2024-01-22").toISOString() },
      { _id: "8", applicationId: "APP-2024-008", studentName: "Robert Taylor", studentId: "STU-2024-008", studentEmail: "robert.taylor@email.com", university: "McMaster University", program: "BEng Mechanical", intake: "Fall 2024", status: "Documents Pending", submittedAt: new Date("2024-01-08").toISOString(), documentCount: 6, lastUpdated: new Date("2024-01-08").toISOString() },
    ];

    // Filter mock data based on search params
    let filtered = mockApplications;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.studentName.toLowerCase().includes(searchLower) ||
        a.applicationId.toLowerCase().includes(searchLower) ||
        a.university.toLowerCase().includes(searchLower) ||
        a.program.toLowerCase().includes(searchLower)
      );
    }
    if (status !== "all") {
      filtered = filtered.filter(a => a.status.toLowerCase().replace(" ", "") === status.toLowerCase().replace(" ", ""));
    }
    if (university !== "all") {
      filtered = filtered.filter(a => a.university === university);
    }
    if (program !== "all") {
      filtered = filtered.filter(a => a.program === program);
    }
    if (intake !== "all") {
      filtered = filtered.filter(a => a.intake === intake);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      applications: paginated,
      total,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error("Partner Applications API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}