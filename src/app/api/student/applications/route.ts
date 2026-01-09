import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import Payment from "@/models/Payment"; // ✅ পেমেন্ট মডেল ইম্পোর্ট করা হলো

export async function POST(req: Request) {
  try {
    // ১. লগইন চেক
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ২. ফ্রন্টএন্ড থেকে ডাটা রিসিভ করা
    const body = await req.json();
    const { 
      universityName, 
      programName, 
      universityId, // যদি থাকে
      programId,    // যদি থাকে
      applicationFee // যদি ফ্রন্টএন্ড থেকে ফি পাঠানো হয়
    } = body;

    // ভ্যালিডেশন
    if (!universityName || !programName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();

    // ৩. অ্যাপ্লিকেশন তৈরি করা
    const newApplication = await Application.create({
      studentEmail: session.user.email,
      universityName,
      programName,
      universityId,
      programId,
      status: "Pending", // শুরুতে পেন্ডিং থাকবে
      appliedDate: new Date(),
    });

    // 💰 ৪. অটোমেটিক ইনভয়েস জেনারেট করা
    // এটি তৈরি করলেই পেমেন্ট পেজে ডিউ দেখাবে
    
    // যদি ফ্রন্টএন্ড থেকে ফি না আসে, তবে ডিফল্ট $50 ধরা হলো
    const feeAmount = applicationFee || 50; 

    const newInvoice = await Payment.create({
      studentEmail: session.user.email,
      invoiceId: `INV-${Date.now()}`, // ইউনিক ইনভয়েস আইডি (যেমন: INV-1709...)
      serviceName: `App Fee - ${universityName}`,
      amount: feeAmount,
      status: "Pending", // পেমেন্ট না করা পর্যন্ত পেন্ডিং থাকবে
      createdAt: new Date()
    });

    return NextResponse.json({ 
      message: "Application submitted successfully", 
      application: newApplication,
      invoice: newInvoice
    });

  } catch (error) {
    console.error("Application Submit Error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}