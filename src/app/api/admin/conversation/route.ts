import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Message from "@/models/Message";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 });
    }

    await connect();

    const messages = await Message.find({
      $or: [
        { sender: studentId },
        { receiver: studentId }
      ]
    })
    .sort({ createdAt: 1 }) 
    .populate("sender", "name role image") 
    .lean();

    return NextResponse.json({ success: true, messages });

  } catch (error) {
    console.error("Admin Conversation API Error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, text } = body;

    if (!studentId || !text) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connect();

    const adminUser = await User.findOne({ email: session.user.email });

    if (!adminUser) {
        return NextResponse.json({ error: "Admin profile not found" }, { status: 404 });
    }

    const newMessage = await Message.create({
      sender: adminUser._id,
      receiver: studentId,
      text: text,
      senderRole: "admin",
      isRead: false
    });

    const populatedMessage = await Message.findById(newMessage._id).populate("sender", "name role image");

    return NextResponse.json({ success: true, message: populatedMessage });

  } catch (error) {
    console.error("Message Send Error:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}