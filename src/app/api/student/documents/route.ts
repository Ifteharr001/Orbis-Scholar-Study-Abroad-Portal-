import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Documents from "@/models/Document";

// ১. ডকুমেন্ট লিস্ট ফেচ করা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // 🚀 Performance:
    // .sort({ uploadedAt: -1 }) -> লেটেস্ট আপলোড সবার উপরে দেখাবে
    // .lean() -> ফাস্ট রেসপন্স
    const docs = await Documents.find({ studentEmail: session.user.email })
      .sort({ uploadedAt: -1 })
      .lean();

    return NextResponse.json(docs);
  } catch (error) {
    console.error("Fetch Documents Error:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

// ২. ডকুমেন্ট আপলোড বা আপডেট করা
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // 🚀 Update: আমরা এখন 'fileUrl' রিসিভ করছি (যা ফ্রন্টএন্ড থেকে আসবে)
    const { name, fileName, fileUrl, category } = body; 

    // ভ্যালিডেশন
    if (!name || !fileName || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();

    // 🔥 Smart Update (Upsert):
    // যদি এই নামের ডকুমেন্ট আগে থাকে -> তবে সেটি আপডেট হবে (Re-upload)
    // যদি না থাকে -> তবে নতুন তৈরি হবে
    const doc = await Documents.findOneAndUpdate(
      { studentEmail: session.user.email, name: name }, // খোঁজার শর্ত
      {
        $set: {
          fileName,
          fileUrl, // রিয়েল URL সেভ হবে
          category: category || "required",
          status: "Pending", // রি-আপলোড করলে স্ট্যাটাস আবার পেন্ডিং হয়ে যাবে
          feedback: "", // আগের রিজেকশন ফিডব্যাক মুছে যাবে
          uploadedAt: new Date(),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true } // অপশনস
    );

    return NextResponse.json(doc, { status: 201 });

  } catch (error) {
    console.error("Upload Document Error:", error);
    return NextResponse.json({ error: "Failed to save document info" }, { status: 500 });
  }
}