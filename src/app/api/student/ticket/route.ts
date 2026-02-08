import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Ticket from "@/models/Ticket";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, type, message } = await req.json();

    await connect();

    const newTicket = await Ticket.create({
      studentEmail: session.user.email,
      subject,
      type,
      message,
    });

    return NextResponse.json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const tickets = await Ticket.find({ studentEmail: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}