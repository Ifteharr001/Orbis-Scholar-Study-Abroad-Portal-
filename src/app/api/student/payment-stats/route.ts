import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Invoice from "@/models/Invoice";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const invoices = await Invoice.find({ studentEmail: session.user.email })
      .sort({ createdAt: -1 }) 
      .lean();

    let totalPaid = 0;
    let totalPending = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invoices.forEach((inv: any) => {
      if (inv.status === "Paid") {
        totalPaid += inv.amount;
      } else if (inv.status === "Pending") {
        totalPending += inv.amount;
      }
    });

    return NextResponse.json({
      stats: {
        totalPaid,
        totalPending,
        totalInvoices: invoices.length
      },
      history: invoices 
    });

  } catch (error) {
    console.error("Payment Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}