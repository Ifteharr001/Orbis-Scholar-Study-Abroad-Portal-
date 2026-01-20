import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Task from "@/models/Task";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const myTasks = await Task.find({ 
      assignedTo: session.user.email 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, tasks: myTasks });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { taskId, status } = body;

    await connect();

    
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, assignedTo: session.user.email },
      { status },
      { new: true }
    );

    if (!updatedTask) {
        return NextResponse.json({ error: "Task not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Status updated", task: updatedTask });

  } catch (error) {
    return NextResponse.json({ error: "Update Error" }, { status: 500 });
  }
}