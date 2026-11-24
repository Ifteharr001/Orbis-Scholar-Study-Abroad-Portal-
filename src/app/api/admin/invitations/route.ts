import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import { Invitation } from "@/models/Invitation";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const invitations = await Invitation.find({})
      .select("email role status expiresAt createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, invitations });

  } catch (error) {
    console.error("Fetch Invitations Error:", error);
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
  }
}