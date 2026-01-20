import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Ticket from "@/models/Ticket";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role"); 

    await connect();

    const query = role ? { role } : {};

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, tickets });

  } catch (error) {
    console.error("Admin Ticket Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, reply, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
    }

    await connect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (reply) updateData.reply = reply;
    if (status) updateData.status = status;

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      updateData,
      { new: true } 
    );

    if (!updatedTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket: updatedTicket });

  } catch (error) {
    console.error("Ticket Update Error:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}