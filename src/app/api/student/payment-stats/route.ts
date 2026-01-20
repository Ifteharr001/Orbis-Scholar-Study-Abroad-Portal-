import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Invoice from "@/models/Invoice"; // 🔥 Payment এর বদলে Invoice ব্যবহার করা হলো

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // ১. সব ইনভয়েস ডাটা আনা (যেহেতু ইনভয়েসেই Paid/Pending স্ট্যাটাস থাকে)
    const invoices = await Invoice.find({ studentEmail: session.user.email })
      .sort({ createdAt: -1 }) 
      .lean();

    // ২. স্ট্যাটস ক্যালকুলেশন
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

    // ৩. ফ্রন্টএন্ডে ডাটা পাঠানো
    return NextResponse.json({
      stats: {
        totalPaid,
        totalPending,
        totalInvoices: invoices.length
      },
      history: invoices // ইনভয়েস লিস্ট পাঠানো হলো যাতে টেবিলে দেখানো যায়
    });

  } catch (error) {
    console.error("Payment Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}