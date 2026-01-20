import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const student = await User.findOne({ email: session.user.email });
    
    if (!student || !student.counselor) {
      return NextResponse.json({ error: "No counselor assigned" }, { status: 404 });
    }

    const messages = await Message.find({
      $or: [
        { sender: student._id, receiver: student.counselor },
        { sender: student.counselor, receiver: student._id }
      ]
    }).sort({ createdAt: 1 }); 

    return NextResponse.json({ success: true, messages, counselorId: student.counselor });

  } catch (error) {
    console.error("Fetch Message Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    await connect();

    const student = await User.findOne({ email: session.user.email });

    if (!student || !student.counselor) {
      return NextResponse.json({ error: "No counselor assigned" }, { status: 404 });
    }

    const newMessage = await Message.create({
      sender: student._id,
      receiver: student.counselor,
      text: text,
      isRead: false
    });

    return NextResponse.json({ success: true, message: newMessage });

  } catch (error) {
    console.error("Message Send Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}