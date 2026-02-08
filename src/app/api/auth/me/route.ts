import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose"; 
import { connect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key-change-it"
    );
    const { payload } = await jwtVerify(token, secret);
    await connect();
    const user = await User.findById(payload.userId).select("name email role image");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image || "",
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
  }
}