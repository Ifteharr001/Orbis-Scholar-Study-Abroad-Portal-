import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Ticket from "@/models/Ticket";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, type, message } = await req.json();

    if (!subject || !message) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connect();

    const newTicket = await Ticket.create({
      userEmail: session.user.email,
      userName: session.user.name,
      role: "counselor",
      subject,
      type,
      message,
      status: "Open"
    });

    return NextResponse.json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error("Counselor Ticket Error:", error);
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

    const tickets = await Ticket.find({ 
        userEmail: session.user.email, 
        role: "counselor" 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}