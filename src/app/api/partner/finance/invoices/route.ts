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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Replace with actual database queries
    // const query: any = { partnerId };
    // if (search) query.$or = [{ invoiceNumber: { $regex: search, $options: "i" } }, { studentName: { $regex: search, $options: "i" } }, { university: { $regex: search, $options: "i" } }];
    // if (status !== "all") query.status = status;
    // const total = await Invoice.countDocuments(query);
    // const invoices = await Invoice.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    // const totalPages = Math.ceil(total / limit);

    // Mock data for now
    const mockInvoices = [
      { _id: "1", invoiceNumber: "INV-2024-001", studentName: "Sarah Johnson", studentId: "STU-2024-001", studentEmail: "sarah.johnson@email.com", university: "University of Toronto", program: "MSc Computer Science", amount: 2500, currency: "CAD", status: "sent", dueDate: new Date("2024-02-15").toISOString(), paidDate: null, items: [{ description: "Tuition Deposit - Fall 2024", amount: 2500, quantity: 1 }], createdAt: new Date("2024-01-10").toISOString() },
      { _id: "2", invoiceNumber: "INV-2024-002", studentName: "Michael Chen", studentId: "STU-2024-002", studentEmail: "michael.chen@email.com", university: "McGill University", program: "MBA", amount: 5000, currency: "CAD", status: "paid", dueDate: new Date("2024-01-30").toISOString(), paidDate: new Date("2024-01-28").toISOString(), items: [{ description: "Tuition - Semester 1", amount: 5000, quantity: 1 }], createdAt: new Date("2024-01-08").toISOString() },
      { _id: "3", invoiceNumber: "INV-2024-003", studentName: "Emily Rodriguez", studentId: "STU-2024-003", studentEmail: "emily.rodriguez@email.com", university: "University of British Columbia", program: "BSc Nursing", amount: 3200, currency: "CAD", status: "overdue", dueDate: new Date("2024-01-10").toISOString(), paidDate: null, items: [{ description: "Application Fee", amount: 200, quantity: 1 }, { description: "Tuition Deposit", amount: 3000, quantity: 1 }], createdAt: new Date("2024-01-05").toISOString() },
      { _id: "4", invoiceNumber: "INV-2024-004", studentName: "David Kim", studentId: "STU-2024-004", studentEmail: "david.kim@email.com", university: "University of Alberta", program: "MEng Electrical", amount: 1800, currency: "CAD", status: "sent", dueDate: new Date("2024-02-20").toISOString(), paidDate: null, items: [{ description: "Tuition Deposit - Fall 2024", amount: 1800, quantity: 1 }], createdAt: new Date("2024-01-12").toISOString() },
      { _id: "5", invoiceNumber: "INV-2024-005", studentName: "Lisa Thompson", studentId: "STU-2024-005", studentEmail: "lisa.thompson@email.com", university: "Western University", program: "MSc Data Science", amount: 4500, currency: "CAD", status: "draft", dueDate: new Date("2024-02-28").toISOString(), paidDate: null, items: [{ description: "Tuition - Semester 1", amount: 4500, quantity: 1 }], createdAt: new Date("2024-01-14").toISOString() },
      { _id: "6", invoiceNumber: "INV-2024-006", studentName: "James Wilson", studentId: "STU-2024-006", studentEmail: "james.wilson@email.com", university: "University of Waterloo", program: "MSc AI", amount: 3800, currency: "CAD", status: "paid", dueDate: new Date("2024-01-25").toISOString(), paidDate: new Date("2024-01-23").toISOString(), items: [{ description: "Application Fee", amount: 300, quantity: 1 }, { description: "Tuition Deposit", amount: 3500, quantity: 1 }], createdAt: new Date("2024-01-05").toISOString() },
      { _id: "7", invoiceNumber: "INV-2024-007", studentName: "Amanda Brown", studentId: "STU-2024-007", studentEmail: "amanda.brown@email.com", university: "Queen's University", program: "MBA", amount: 6200, currency: "CAD", status: "partial", dueDate: new Date("2024-02-10").toISOString(), paidDate: null, items: [{ description: "Tuition - Semester 1", amount: 6200, quantity: 1 }], createdAt: new Date("2024-01-09").toISOString() },
      { _id: "8", invoiceNumber: "INV-2024-008", studentName: "Robert Taylor", studentId: "STU-2024-008", studentEmail: "robert.taylor@email.com", university: "McMaster University", program: "BEng Mechanical", amount: 2100, currency: "CAD", status: "cancelled", dueDate: new Date("2024-02-01").toISOString(), paidDate: null, items: [{ description: "Application Fee", amount: 2100, quantity: 1 }], createdAt: new Date("2024-01-07").toISOString() },
    ];

    // Filter mock data based on search params
    let filtered = mockInvoices;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(i =>
        i.invoiceNumber.toLowerCase().includes(searchLower) ||
        i.studentName.toLowerCase().includes(searchLower) ||
        i.university.toLowerCase().includes(searchLower)
      );
    }
    if (status !== "all") {
      filtered = filtered.filter(i => i.status === status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      invoices: paginated,
      total,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error("Partner Invoices API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}