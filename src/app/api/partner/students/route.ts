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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Replace with actual database queries
    // const query: any = { partnerId };
    // if (search) query.$or = [{ firstName: { $regex: search, $options: "i" } }, { lastName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    // if (status !== "all") query.status = status;
    // if (university !== "all") query.university = university;
    // if (program !== "all") query.program = program;
    // const total = await Student.countDocuments(query);
    // const students = await Student.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    // const totalPages = Math.ceil(total / limit);

    // Mock data for now
    const mockStudents = [
      { _id: "1", studentId: "STU-2024-001", firstName: "Sarah", lastName: "Johnson", email: "sarah.johnson@email.com", phone: "+1 (555) 123-4567", university: "University of Toronto", program: "MSc Computer Science", intake: "Fall 2024", status: "Active", applicationCount: 3, documentCount: 8, createdAt: new Date("2023-09-15").toISOString() },
      { _id: "2", studentId: "STU-2024-002", firstName: "Michael", lastName: "Chen", email: "michael.chen@email.com", phone: "+1 (555) 234-5678", university: "McGill University", program: "MBA", intake: "Fall 2024", status: "Active", applicationCount: 2, documentCount: 12, createdAt: new Date("2023-10-20").toISOString() },
      { _id: "3", studentId: "STU-2024-003", firstName: "Emily", lastName: "Rodriguez", email: "emily.rodriguez@email.com", phone: "+1 (555) 345-6789", university: "University of British Columbia", program: "BSc Nursing", intake: "Winter 2025", status: "Accepted", applicationCount: 1, documentCount: 15, createdAt: new Date("2023-11-05").toISOString() },
      { _id: "4", studentId: "STU-2024-004", firstName: "David", lastName: "Kim", email: "david.kim@email.com", phone: "+1 (555) 456-7890", university: "University of Alberta", program: "MEng Electrical", intake: "Fall 2024", status: "Pending", applicationCount: 1, documentCount: 5, createdAt: new Date("2023-12-01").toISOString() },
      { _id: "5", studentId: "STU-2024-005", firstName: "Lisa", lastName: "Thompson", email: "lisa.thompson@email.com", phone: "+1 (555) 567-8901", university: "Western University", program: "MSc Data Science", intake: "Fall 2024", status: "Active", applicationCount: 2, documentCount: 10, createdAt: new Date("2023-12-10").toISOString() },
      { _id: "6", studentId: "STU-2024-006", firstName: "James", lastName: "Wilson", email: "james.wilson@email.com", phone: "+1 (555) 678-9012", university: "University of Waterloo", program: "MSc AI", intake: "Winter 2025", status: "Active", applicationCount: 1, documentCount: 7, createdAt: new Date("2024-01-05").toISOString() },
      { _id: "7", studentId: "STU-2024-007", firstName: "Amanda", lastName: "Brown", email: "amanda.brown@email.com", phone: "+1 (555) 789-0123", university: "Queen's University", program: "MBA", intake: "Fall 2024", status: "Accepted", applicationCount: 1, documentCount: 11, createdAt: new Date("2024-01-10").toISOString() },
      { _id: "8", studentId: "STU-2024-008", firstName: "Robert", lastName: "Taylor", email: "robert.taylor@email.com", phone: "+1 (555) 890-1234", university: "McMaster University", program: "BEng Mechanical", intake: "Fall 2024", status: "Pending", applicationCount: 2, documentCount: 6, createdAt: new Date("2024-01-12").toISOString() },
    ];

    // Filter mock data based on search params
    let filtered = mockStudents;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(s =>
        s.firstName.toLowerCase().includes(searchLower) ||
        s.lastName.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.studentId.toLowerCase().includes(searchLower)
      );
    }
    if (status !== "all") {
      filtered = filtered.filter(s => s.status.toLowerCase() === status.toLowerCase());
    }
    if (university !== "all") {
      filtered = filtered.filter(s => s.university === university);
    }
    if (program !== "all") {
      filtered = filtered.filter(s => s.program === program);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      students: paginated,
      total,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error("Partner Students API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partnerId = (session.user as any).id || (session.user as any).partnerId;
    const body = await request.json();

    // TODO: Create student in database
    // const student = await Student.create({ ...body, partnerId });

    return NextResponse.json({ message: "Student created successfully", student: { _id: "new", ...body, partnerId, createdAt: new Date().toISOString() } }, { status: 201 });
  } catch (error) {
    console.error("Create Student Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}