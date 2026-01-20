import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Payment from "@/models/Payment";

// ✅ GET: সব পেমেন্ট হিস্ট্রি লোড করা
export async function GET() {
  try {
    await connect();
    const payments = await Payment.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// ✅ POST: ম্যানুয়াল পেমেন্ট এন্ট্রি (যদি লাগে)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connect();

    const newPayment = await Payment.create({
        ...body,
        transactionId: `TXN-${Date.now()}`, // Auto generate ID for manual entry
        date: new Date()
    });

    return NextResponse.json({ success: true, data: newPayment });
  } catch (error) {
    return NextResponse.json({ error: "Payment entry failed" }, { status: 500 });
  }
}