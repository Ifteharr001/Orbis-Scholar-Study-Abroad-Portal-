import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // ১. সব পেমেন্ট ডাটা আনা (লেটেস্ট আগে + ফাস্ট লোডিং)
    const payments = await Payment.find({ studentEmail: session.user.email })
      .sort({ createdAt: -1 }) // ✅ নতুন ইনভয়েস সবার উপরে থাকবে
      .lean(); // ✅ API রেসপন্স ফাস্ট করবে

    // ২. কাউন্ট করা
    let totalPaid = 0;
    let totalPending = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payments.forEach((payment: any) => {
      if (payment.status === "Paid") {
        totalPaid += payment.amount;
      } else if (payment.status === "Pending") {
        totalPending += payment.amount;
      }
    });

    // ৩. ফ্রন্টএন্ডে যেভাবে ডাটা দরকার সেভাবে পাঠানো
    return NextResponse.json({
      stats: {
        totalPaid,
        totalPending,
        totalInvoices: payments.length
      },
      history: payments // টেবিলের জন্য লিস্ট
    });

  } catch (error) {
    console.error("Payment Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}