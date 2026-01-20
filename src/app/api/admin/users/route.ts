import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";

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

    const users = await User.find(query)
      .select("name email image role")
      .sort({ createdAt: -1 }); 

    return NextResponse.json({ success: true, users });

  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}