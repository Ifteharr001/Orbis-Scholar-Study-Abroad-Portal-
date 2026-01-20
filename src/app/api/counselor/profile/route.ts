import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "counselor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const user = await User.findOne({ email: session.user.email }).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "counselor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connect();

    delete body.email;
    delete body.password;
    delete body.role;
    delete body._id;

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });

  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}