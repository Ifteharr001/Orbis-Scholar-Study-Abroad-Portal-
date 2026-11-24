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
    const method = searchParams.get("method") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Replace with actual database queries
    // const query: any = { partnerId };
    // if (search) query.$or = [{ paymentId: { $regex: search, $options: "i" } }, { studentName: { $regex: search, $options: "i" } }, { invoiceNumber: { $regex: search, $options: "i" } }];
    // if (status !== "all") query.status = status;
    // if (method !== "all") query.method = method;
    // const total = await Payment.countDocuments(query);
    // const payments = await Payment.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    // const totalPages = Math.ceil(total / limit);

    // Mock data for now
    const mockPayments = [
      { _id: "1", paymentId: "PAY-2024-001", invoiceNumber: "INV-2024-002", invoiceId: "2", studentName: "Michael Chen", studentId: "STU-2024-002", studentEmail: "michael.chen@email.com", university: "McGill University", program: "MBA", amount: 5000, currency: "CAD", method: "bank_transfer", status: "completed", transactionId: "TXN-784521", paidAt: new Date("2024-01-28").toISOString(), createdAt: new Date("2024-01-28").toISOString() },
      { _id: "2", paymentId: "PAY-2024-002", invoiceNumber: "INV-2024-006", invoiceId: "6", studentName: "James Wilson", studentId: "STU-2024-006", studentEmail: "james.wilson@email.com", university: "University of Waterloo", program: "MSc AI", amount: 3800, currency: "CAD", method: "credit_card", status: "completed", transactionId: "TXN-784522", paidAt: new Date("2024-01-23").toISOString(), createdAt: new Date("2024-01-23").toISOString() },
      { _id: "3", paymentId: "PAY-2024-003", invoiceNumber: "INV-2024-001", invoiceId: "1", studentName: "Sarah Johnson", studentId: "STU-2024-001", studentEmail: "sarah.johnson@email.com", university: "University of Toronto", program: "MSc Computer Science", amount: 2500, currency: "CAD", method: "paypal", status: "pending", transactionId: "TXN-784523", paidAt: new Date("2024-01-15").toISOString(), createdAt: new Date("2024-01-15").toISOString() },
      { _id: "4", paymentId: "PAY-2024-004", invoiceNumber: "INV-2024-003", invoiceId: "3", studentName: "Emily Rodriguez", studentId: "STU-2024-003", studentEmail: "emily.rodriguez@email.com", university: "University of British Columbia", program: "BSc Nursing", amount: 3200, currency: "CAD", method: "bank_transfer", status: "failed", transactionId: "TXN-784524", paidAt: new Date("2024-01-10").toISOString(), createdAt: new Date("2024-01-10").toISOString() },
      { _id: "5", paymentId: "PAY-2024-005", invoiceNumber: "INV-2024-007", invoiceId: "7", studentName: "Amanda Brown", studentId: "STU-2024-007", studentEmail: "amanda.brown@email.com", university: "Queen's University", program: "MBA", amount: 3000, currency: "CAD", method: "stripe", status: "completed", transactionId: "TXN-784525", paidAt: new Date("2024-01-20").toISOString(), createdAt: new Date("2024-01-20").toISOString() },
      { _id: "6", paymentId: "PAY-2024-006", invoiceNumber: "INV-2024-004", invoiceId: "4", studentName: "David Kim", studentId: "STU-2024-004", studentEmail: "david.kim@email.com", university: "University of Alberta", program: "MEng Electrical", amount: 1800, currency: "CAD", method: "cash", status: "pending", transactionId: "TXN-784526", paidAt: new Date("2024-01-18").toISOString(), createdAt: new Date("2024-01-18").toISOString() },
      { _id: "7", paymentId: "PAY-2024-007", invoiceNumber: "INV-2024-005", invoiceId: "5", studentName: "Lisa Thompson", studentId: "STU-2024-005", studentEmail: "lisa.thompson@email.com", university: "Western University", program: "MSc Data Science", amount: 4500, currency: "CAD", method: "credit_card", status: "refunded", transactionId: "TXN-784527", paidAt: new Date("2024-01-22").toISOString(), createdAt: new Date("2024-01-22").toISOString() },
      { _id: "8", paymentId: "PAY-2024-008", invoiceNumber: "INV-2024-002", invoiceId: "2", studentName: "Michael Chen", studentId: "STU-2024-002", studentEmail: "michael.chen@email.com", university: "McGill University", program: "MBA", amount: 2500, currency: "CAD", method: "bank_transfer", status: "completed", transactionId: "TXN-784528", paidAt: new Date("2024-01-12").toISOString(), createdAt: new Date("2024-01-12").toISOString() },
    ];

    // Filter mock data based on search params
    let filtered = mockPayments;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.paymentId.toLowerCase().includes(searchLower) ||
        p.studentName.toLowerCase().includes(searchLower) ||
        p.invoiceNumber.toLowerCase().includes(searchLower)
      );
    }
    if (status !== "all") {
      filtered = filtered.filter(p => p.status === status);
    }
    if (method !== "all") {
      filtered = filtered.filter(p => p.method === method);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      payments: paginated,
      total,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error("Partner Payments API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}