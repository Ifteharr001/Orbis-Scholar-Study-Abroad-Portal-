import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await connect();
    const payments = await Payment.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connect();

    const newPayment = await Payment.create({
        ...body,
        transactionId: `TXN-${Date.now()}`, 
        date: new Date()
    });

    return NextResponse.json({ success: true, data: newPayment });
  } catch (error) {
    return NextResponse.json({ error: "Payment entry failed" }, { status: 500 });
  }
}