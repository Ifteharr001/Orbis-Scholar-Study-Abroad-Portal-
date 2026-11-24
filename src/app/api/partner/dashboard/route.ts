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

    // TODO: Replace with actual database queries
    // const partner = await Partner.findById(partnerId);
    // const students = await Student.countDocuments({ partnerId });
    // const applications = await Application.countDocuments({ partnerId });
    // const documents = await Document.countDocuments({ partnerId });
    // const invoices = await Invoice.find({ partnerId });
    // const pendingInvoices = invoices.filter(i => i.status === "sent" || i.status === "overdue").length;
    // const totalRevenue = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
    // const pendingAmount = invoices.filter(i => i.status === "sent" || i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);
    // const recentApplications = await Application.find({ partnerId }).sort({ createdAt: -1 }).limit(5);
    // const recentInvoices = await Invoice.find({ partnerId }).sort({ createdAt: -1 }).limit(5);

    // Mock data for now
    const mockStats = {
      totalStudents: 142,
      activeApplications: 28,
      pendingDocuments: 15,
      pendingInvoices: 7,
      totalRevenue: 125400,
      pendingAmount: 18750,
      studentGrowth: 12,
      applicationGrowth: 8,
      documentGrowth: -3,
      revenueGrowth: 15
    };

    const mockRecentApplications = [
      { _id: "1", studentName: "Sarah Johnson", university: "University of Toronto", program: "MSc Computer Science", status: "Submitted", submittedAt: new Date("2024-01-15").toISOString() },
      { _id: "2", studentName: "Michael Chen", university: "McGill University", program: "MBA", status: "Under Review", submittedAt: new Date("2024-01-14").toISOString() },
      { _id: "3", studentName: "Emily Rodriguez", university: "University of British Columbia", program: "BSc Nursing", status: "Accepted", submittedAt: new Date("2024-01-13").toISOString() },
      { _id: "4", studentName: "David Kim", university: "University of Alberta", program: "MEng Electrical", status: "Documents Pending", submittedAt: new Date("2024-01-12").toISOString() },
      { _id: "5", studentName: "Lisa Thompson", university: "Western University", program: "MSc Data Science", status: "Submitted", submittedAt: new Date("2024-01-11").toISOString() },
    ];

    const mockRecentInvoices = [
      { _id: "1", invoiceNumber: "INV-2024-001", studentName: "Sarah Johnson", amount: 2500, currency: "CAD", status: "sent", dueDate: new Date("2024-02-15").toISOString() },
      { _id: "2", invoiceNumber: "INV-2024-002", studentName: "Michael Chen", amount: 5000, currency: "CAD", status: "paid", dueDate: new Date("2024-01-30").toISOString() },
      { _id: "3", invoiceNumber: "INV-2024-003", studentName: "Emily Rodriguez", amount: 3200, currency: "CAD", status: "overdue", dueDate: new Date("2024-01-10").toISOString() },
      { _id: "4", invoiceNumber: "INV-2024-004", studentName: "David Kim", amount: 1800, currency: "CAD", status: "sent", dueDate: new Date("2024-02-20").toISOString() },
      { _id: "5", invoiceNumber: "INV-2024-005", studentName: "Lisa Thompson", amount: 4500, currency: "CAD", status: "draft", dueDate: new Date("2024-02-28").toISOString() },
    ];

    return NextResponse.json({
      stats: mockStats,
      recentApplications: mockRecentApplications,
      recentInvoices: mockRecentInvoices
    });
  } catch (error) {
    console.error("Partner Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}