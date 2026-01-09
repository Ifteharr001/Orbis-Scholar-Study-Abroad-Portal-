import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import User from "@/models/User";

// ১. লগইন করা স্টুডেন্টের প্রোফাইল তথ্য আনা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // ইউজারের সব তথ্য আনা (শুধু পাসওয়ার্ড বাদে)
    // .lean() ব্যবহার করা হয়েছে ফাস্ট রেসপন্সের জন্য
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

// ২. প্রোফাইল আপডেট করা (যেমন: ফোন নম্বর, দেশ, বা ছবি)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // আমরা ইউজারকে রোল (Role) বা ইমেইল পরিবর্তন করতে দিব না, তাই সেগুলো বাদ দিয়ে আপডেট করব
    const { phone, gender, country, address, image, programPreference, bio } = body;

    await connect();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          phone,
          gender,
          country,
          image, // প্রোফাইল পিকচার আপডেট
          programPreference,
          bio,
          // address যদি মডেলে না থাকে তবে এটি কাজ করবে না, 
          // আমাদের User মডেলে 'address' ফিল্ড নেই, তাই এটি আপাতত বাদ দিতে পারেন বা মডেলে এড করতে পারেন।
        },
      },
      { new: true } // আপডেটেড ডাটা রিটার্ন করবে
    ).select("-password");

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}