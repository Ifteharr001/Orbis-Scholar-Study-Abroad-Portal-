import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Message from "@/models/Message";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const counselorId = token.id || token.sub;
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 });
    }

    const messages = await Message.find({
      $or: [
        { sender: counselorId, receiver: studentId },
        { sender: studentId, receiver: counselorId }
      ]
    }).sort({ createdAt: 1 }); 

    return NextResponse.json({ success: true, messages });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const counselorId = token.id || token.sub;
    const body = await req.json();
    const { studentId, text } = body;

    if (!studentId || !text) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newMessage = await Message.create({
        sender: counselorId,
        receiver: studentId,
        text: text
    });

    return NextResponse.json({ success: true, message: newMessage });

  } catch (error) {
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}