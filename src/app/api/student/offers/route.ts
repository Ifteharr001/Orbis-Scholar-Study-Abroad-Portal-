import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Application from "@/models/Application";

// GET Method: অফার লোড করার জন্য
export async function GET(req: Request) {
  try {
    // ১. সিকিউরিটি চেক: ইউজার লগইন করা আছে কিনা?
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized: Please login first" },
        { status: 401 }
      );
    }

    await connect();

    // ২. URL থেকে ইমেইল না নিয়ে, সেশন থেকে ইমেইল নেওয়া হলো (Secure) 🔒
    const email = session.user.email;

    // ৩. ডাটা ফেচিং
    // অফার পেজে সাধারণত আমরা শুধু সেই অ্যাপ্লিকেশানগুলোই দেখাতে চাই যেগুলোর অফার এসেছে।
    // অথবা আপনি চাইলে সব দেখিয়ে ফ্রন্টএন্ডে ফিল্টার করতে পারেন।
    // এখানে সব আনা হচ্ছে, কিন্তু .lean() ব্যবহার করে ফাস্ট করা হয়েছে।
    const applications = await Application.find({ 
        studentEmail: email,
        // অপশনাল: যদি শুধু অফার লেটার দেখাতে চান, তবে নিচের লাইনটি আনকমেন্ট করুন
        // status: { $in: ["Offer Received", "Conditional Offer"] } 
    })
    .sort({ updatedAt: -1 }) // লেটেস্ট আপডেট সবার আগে
    .lean();

    return NextResponse.json({ 
      success: true, 
      data: applications 
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Offers Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { message: "Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}