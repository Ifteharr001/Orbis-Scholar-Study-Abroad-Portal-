import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Document from "@/models/Document";

// ১. ডকুমেন্ট লিস্ট ফেচ করা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const documents = await Document.find({ studentEmail: session.user.email });

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

// ২. নতুন ডকুমেন্ট আপলোড করা (আপাতত ফাইল সেভ লজিক ডামি)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, fileName, category } = body; 
    // নোট: রিয়েল প্রজেক্টে এখানে ফাইল আপলোড লজিক (AWS S3 / Cloudinary) থাকবে।
    // আপাতত আমরা শুধু ডাটাবেসে এন্ট্রি করছি।

    await connect();

    // চেক করা যদি একই নামের ডকুমেন্ট আগে থাকে, তাহলে আপডেট করা
    let doc = await Document.findOne({ studentEmail: session.user.email, name });

    if (doc) {
      doc.fileName = fileName;
      doc.fileUrl = "/uploads/dummy-url.pdf"; // ডামি URL
      doc.status = "Pending";
      doc.uploadedAt = new Date();
      await doc.save();
    } else {
      doc = await Document.create({
        studentEmail: session.user.email,
        name,
        fileName,
        fileUrl: "/uploads/dummy-url.pdf",
        category: category || "optional",
      });
    }

    return NextResponse.json(doc, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}