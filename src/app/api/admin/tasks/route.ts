import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Task from "@/models/Task";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();
    const tasks = await Task.find({ assignedTo: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return NextResponse.json({ error: "Fetch Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connect();

    const newTask = await Task.create({
      ...body,
      assignedTo: session.user.email
    });

    return NextResponse.json({ success: true, data: newTask });
  } catch (error) {
    return NextResponse.json({ error: "Create Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    await connect();
    await Task.findByIdAndUpdate(id, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update Error" }, { status: 500 });
  }
}

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