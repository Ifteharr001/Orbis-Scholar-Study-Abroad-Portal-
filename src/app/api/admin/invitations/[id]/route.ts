import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import { Invitation } from "@/models/Invitation";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connect();

    const invitation = await Invitation.findByIdAndDelete(id);

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Invitation revoked successfully" });

  } catch (error) {
    console.error("Delete Invitation Error:", error);
    return NextResponse.json({ error: "Failed to revoke invitation" }, { status: 500 });
  }
}