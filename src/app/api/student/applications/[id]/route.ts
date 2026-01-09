import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ১. লগইন চেক (Authentication)
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // ২. আইডি ভ্যালিডেশন (Server Crash রোধ করতে)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Application ID" }, { status: 400 });
    }

    await connect();

    // ৩. ডাটা ফেচিং (Performance: .lean() ব্যবহার করা হলো)
    const application = await Application.findById(id).lean();

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // ৪. সিকিউরিটি চেক: ওনারশিপ ভেরিফিকেশন (Ownership Check) 🔒
    // ডাটাবেসের studentEmail আর সেশনের ইমেইল না মিললে ডাটা দেখানো যাবে না
    if (application.studentEmail !== session.user.email) {
      return NextResponse.json({ error: "Access Denied: You do not own this application" }, { status: 403 });
    }

    return NextResponse.json(application);

  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}