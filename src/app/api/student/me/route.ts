import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// আপনার authOptions ঠিক কোথা থেকে এক্সপোর্ট হচ্ছে সেই পাথটি নিশ্চিত করবেন
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { connect } from "@/lib/db";
// 👇 ফিক্স ১: ব্র্যাকেট ছাড়া ইমপোর্ট (Default Import)
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

// ২. প্রোফাইল আপডেট করা
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // 👇 ফিক্স ২: 'address' বাদ দেওয়া হয়েছে কারণ User মডেলে এটি নেই
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
      { new: true } // আপডেটেড ডাটা রিটার্ন করবে
    ).select("-password");

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}