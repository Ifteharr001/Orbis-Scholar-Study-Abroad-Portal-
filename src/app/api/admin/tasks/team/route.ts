import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User"; // ইউজার মডেল ইম্পোর্ট করা হলো

// ✅ GET: টিম মেম্বার এবং অ্যাসাইন করা টাস্ক লোড করা
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();

    // ১. টিম মেম্বারদের লিস্ট আনা (যাদের রোল partner, counselor বা staff)
    const teamMembers = await User.find({ 
      role: { $in: ["partner", "counselor", "staff"] } 
    }).select("name email role image");

    // ২. অ্যাডমিনের দেওয়া টাস্কগুলো আনা (যেগুলো সে অন্যদের দিয়েছে)
    const assignedTasks = await Task.find({ 
      assignedBy: session.user.email 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      teamMembers, 
      tasks: assignedTasks 
    });

  } catch (error) {
    return NextResponse.json({ error: "Fetch Error" }, { status: 500 });
  }
}

// ✅ POST: টাস্ক অ্যাসাইন করা (এক বা একাধিক ব্যক্তিকে)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, priority, dueDate, assignees } = body; 
    // assignees হবে একটি array of objects: [{email, name, role}, ...]

    if (!assignees || assignees.length === 0) {
        return NextResponse.json({ error: "Select at least one member" }, { status: 400 });
    }

    await connect();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tasksToCreate = assignees.map((member: any) => ({
      title,
      description,
      priority,
      dueDate,
      assignedBy: session.user.email, // অ্যাডমিন দিচ্ছে
      assignedTo: member.email,       // যে পাচ্ছে
      assignedToName: member.name,
      assignedToRole: member.role,
      status: "Pending"
    }));

    await Task.insertMany(tasksToCreate);

    return NextResponse.json({ success: true, message: "Tasks assigned successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Create Error" }, { status: 500 });
  }
}

// ✅ DELETE: টাস্ক ডিলিট করা
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        await connect();
        await Task.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete Error" }, { status: 500 });
    }
}