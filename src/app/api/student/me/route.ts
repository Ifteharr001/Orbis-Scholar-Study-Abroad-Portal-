import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { connect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const user = await User.findOne({ email: session.user.email })
      .select("-password") 
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Fetch Profile Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    const { phone, gender, country, image, programPreference, bio } = body;

    await connect();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          phone,
          gender,
          country,
          image,
          programPreference,
          bio,
        },
      },
      { new: true } 
    ).select("-password");

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}