import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";

// ১. প্রোফাইল ডাটা ফেচ করা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // 🚀 Performance Update: .lean() ব্যবহার করা হয়েছে
    const user = await User.findOne({ email: session.user.email })
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      fullName: user.name,
      email: user.email,
      phone: user.phone || "",
      country: user.country || "",
      gender: user.gender || "",
      programPreference: user.programPreference || "Masters",
      image: user.image || "", 
      bio: user.bio || "" // Bio ফিল্ডটিও পাঠালাম (যদি লাগে)
    });

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// ২. প্রোফাইল আপডেট করা
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    const { fullName, phone, country, gender, programPreference, image, bio } = body;

    // ১. ভ্যালিডেশন: নাম খালি রাখা যাবে না
    if (!fullName) {
        return NextResponse.json({ error: "Full Name is required" }, { status: 400 });
    }

    await connect();

    // ২. ডাটাবেস আপডেট
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: {
            name: fullName, 
            phone, 
            country, 
            gender,
            programPreference,
            image,
            bio
        }
      },
      { new: true } // আপডেটেড ডাটা রিটার্ন করবে
    ).select("-password");

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}