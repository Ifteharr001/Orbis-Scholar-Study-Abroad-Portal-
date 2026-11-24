import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";

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

    // Prevent self-deletion
    const sessionUser = await User.findOne({ email: session.user.email });
    if (sessionUser && sessionUser._id.toString() === id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    await connect();

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User removed successfully" });

  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ error: "Failed to remove user" }, { status: 500 });
  }
}