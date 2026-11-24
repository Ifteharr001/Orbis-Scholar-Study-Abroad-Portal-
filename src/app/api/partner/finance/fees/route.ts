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
    const category = searchParams.get("category") || "all";
    const level = searchParams.get("level") || "all";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Replace with actual database queries
    // const query: any = { partnerId };
    // if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { university: { $regex: search, $options: "i" } }, { program: { $regex: search, $options: "i" } }];
    // if (category !== "all") query.category = category;
    // if (level !== "all") query.level = level;
    // if (status !== "all") query.isActive = status === "active";
    // const total = await Fee.countDocuments(query);
    // const fees = await Fee.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    // const totalPages = Math.ceil(total / limit);

    // Mock data for now
    const mockFees = [
      { _id: "1", feeId: "FEE-2024-001", name: "Tuition - Fall 2024", university: "University of Toronto", universityId: "UNI-001", program: "MSc Computer Science", programId: "PROG-001", level: "graduate", category: "tuition", amount: 12500, currency: "CAD", frequency: "per-semester", isActive: true, effectiveFrom: new Date("2024-01-01").toISOString(), effectiveTo: new Date("2024-12-31").toISOString(), description: "Graduate tuition for Computer Science programs", createdAt: new Date("2023-10-01").toISOString(), updatedAt: new Date("2023-10-01").toISOString() },
      { _id: "2", feeId: "FEE-2024-002", name: "Application Fee", university: "University of Toronto", universityId: "UNI-001", program: "MSc Computer Science", programId: "PROG-001", level: "graduate", category: "application", amount: 150, currency: "CAD", frequency: "one-time", isActive: true, effectiveFrom: new Date("2024-01-01").toISOString(), effectiveTo: new Date("2024-12-31").toISOString(), description: "Non-refundable application processing fee", createdAt: new Date("2023-10-01").toISOString(), updatedAt: new Date("2023-10-01").toISOString() },
      { _id: "3", feeId: "FEE-2024-003", name: "Tuition - MBA Program", university: "McGill University", universityId: "UNI-002", program: "MBA", programId: "PROG-002", level: "graduate", category: "tuition", amount: 18000, currency: "CAD", frequency: "per-semester", isActive: true, effectiveFrom: new Date("2024-01-01").toISOString(), effectiveTo: new Date("2024-12-31").toISOString(), description: "Full-time MBA tuition per semester", createdAt: new Date("2023-10-01").toISOString(), updatedAt: new Date("2023-10-01").toISOString() },
      { _id: "4", feeId: "FEE-2024-004", name: "Registration Fee", university: "McGill University", universityId: "UNI-002", program: "MBA", programId: "PROG-002", level: "graduate", category: "registration", amount: 500, currency: "CAD", frequency: "one-time", isActive: true, effectiveFrom: new Date("2024-01-01").toISOString(), effectiveTo: new Date("2024-12-31").toISOString(), description: "One-time registration fee for new students", createdAt: new Date("2023-10-01").toISOString(), updatedAt: new Date("2023-10-01").toISOString() },
      { _id: "5", feeId: "FEE-2024-005", name: "Tuition - BSc Nursing", university: "University of British Columbia", universityId: "UNI-003", program: "BSc Nursing", programId: "PROG-003", level: "undergraduate", category: "tuition", amount: 8500, currency: "CAD", frequency: "per-year", isActive: true, effectiveFrom: new Date("2024-01-01").toISOString(), effectiveTo: new Date("2024-12-31").toISOString(), description: "Annual tuition for Nursing program", createdAt: new Date("2023-10-01").toISOString(), updatedAt: new Date("2023-10-01").toISOString() },
      { _id: "6", feeId: "FEE-2024-006", name: "Technology Fee", university: "University of British Columbia", universityId: "UNI-003", program: "BSc Nursing", programId: "PROG-003", level: "undergraduate", category: "technology", amount: 200, currency: "CAD", frequency: "per-semester", isActive: true, effectiveFrom: new Date("2024-01-01").toISOString(), effectiveTo: new Date("2024-12-31").toISOString(), description: "Technology and lab access fee per semester", createdAt: new Date("2023-10-01").toISOString(), updatedAt: new Date("2023-10-01").toISOString() },
      { _id: "7", feeId: "FEE-2024-007", name: "Tuition - MEng Electrical", university: "University of Alberta", universityId: "UNI-004", program: "MEng Electrical", programId: "PROG-004", level: "graduate", category: "tuition", amount: 9800, currency: "CAD", frequency: "per-semester", isActive: true, effectiveFrom: new Date("2024-01-01").toISOString(), effectiveTo: new Date("2024-12-31").toISOString(), description: "Graduate engineering tuition per semester", createdAt: new Date("2023-10-01").toISOString(), updatedAt: new Date("2023-10-01").toISOString() },
      { _id: "8", feeId: "FEE-2024-008", name: "Health Insurance", university: "University of Alberta", universityId: "UNI-004", program: "MEng Electrical", programId: "PROG-004", level: "graduate", category: "health", amount: 350, currency: "CAD", frequency: "per-year", isActive: false, effectiveFrom: new Date("2023-01-01").toISOString(), effectiveTo: new Date("2023-12-31").toISOString(), description: "Annual health insurance for international students", createdAt: new Date("2022-10-01").toISOString(), updatedAt: new Date("2023-12-01").toISOString() },
    ];

    // Filter mock data based on search params
    let filtered = mockFees;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchLower) ||
        f.university.toLowerCase().includes(searchLower) ||
        f.program.toLowerCase().includes(searchLower) ||
        f.feeId.toLowerCase().includes(searchLower)
      );
    }
    if (category !== "all") {
      filtered = filtered.filter(f => f.category === category);
    }
    if (level !== "all") {
      filtered = filtered.filter(f => f.level === level);
    }
    if (status !== "all") {
      filtered = filtered.filter(f => f.isActive === (status === "active"));
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      fees: paginated,
      total,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error("Partner Fees API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}