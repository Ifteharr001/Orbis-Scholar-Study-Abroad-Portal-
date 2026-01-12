import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { Invitation } from "@/models/Invitation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.json({ message: "Token missing" }, { status: 400 });

  await connect();

  const invite = await Invitation.findOne({ 
    token, 
    status: "pending",
    expiresAt: { $gt: new Date() } 
  });

  if (!invite) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 404 });
  }

  return NextResponse.json({ email: invite.email, role: invite.role });
}