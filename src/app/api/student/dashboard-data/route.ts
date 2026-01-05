/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Application from "@/models/Application";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const email = session?.user?.email;

    // ১. সব অ্যাপ্লিকেশন খুঁজে বের করা
    let applications: any[] = [];
    try {
        applications = await Application.find({ studentEmail: email }).sort({ appliedDate: -1 });
    } catch (error) {
        console.log("Application model error:", error);
    }

    // ২. নোটিফিকেশন বা অ্যাকশন আইটেম খুঁজে বের করা
    let actions: any[] = [];
    try {
        actions = await Notification.find({ studentEmail: email, isRead: false }).limit(5);
    } catch (error) {
        console.log("Notification model error:", error);
    }

    // ৩. কাউন্সিলর ইনফো বের করা
    let counselor = null;
    try {
        const currentUser = await User.findOne({ email });
        // (currentUser as any) ব্যবহার করা হয়েছে টাইপ এরর এড়াতে
        if (currentUser && (currentUser as any).assignedCounselor) {
            counselor = await User.findById((currentUser as any).assignedCounselor).select("name email phone");
        }
    } catch (error) {
        console.log("User/Counselor fetch error:", error);
    }

    // ৪. স্ট্যাটস গণনা করা
    const stats = {
      applications: applications.length,
      pendingDocs: 2, 
      offers: applications.filter((app: any) => app.status === "Offer Received").length,
      unreadMessages: actions.length,
    };

    return NextResponse.json({ stats, applications, actions, counselor });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}