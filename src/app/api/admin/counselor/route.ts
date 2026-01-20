import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const verifyAdmin = async () => {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) return false;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-it");
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
};

export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }

    await connect();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    let query = {};
    if (role) {
      query = { role: role };
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(users);

  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}