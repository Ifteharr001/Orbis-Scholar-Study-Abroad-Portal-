import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import Payment from "@/models/Payment"; 

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      universityName, 
      programName, 
      universityId, 
      programId,     
      applicationFee 
    } = body;

    if (!universityName || !programName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();

    const newApplication = await Application.create({
      studentEmail: session.user.email,
      universityName,
      programName,
      universityId,
      programId,
      status: "Pending",
      appliedDate: new Date(),
    });

    const feeAmount = applicationFee ? Number(applicationFee) : 50; 

    const newInvoice = await Payment.create({
      studentEmail: session.user.email,
      invoiceId: `INV-${Date.now()}`,
      serviceName: `App Fee - ${universityName}`,
      amount: feeAmount,
      status: "Pending",
      createdAt: new Date()
    });

    return NextResponse.json({ 
      message: "Application submitted successfully", 
      application: newApplication,
      invoice: newInvoice
    });

  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Application Submit Error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}