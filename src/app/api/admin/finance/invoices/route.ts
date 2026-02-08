import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Invoice from "@/models/Invoice";

export async function GET() {
  try {
    await connect();
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    await connect();

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedInvoice });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}