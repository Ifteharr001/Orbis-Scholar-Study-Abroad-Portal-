import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import SettingsPipeline from "@/models/SettingsPipeline"; 

export async function GET() {
  try {
    await connect();
    const pipelines = await SettingsPipeline.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: pipelines });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pipelines" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connect();

    const lastItem = await SettingsPipeline.findOne().sort({ order: -1 });
    const newOrder = lastItem ? lastItem.order + 1 : 1;

    const newPipeline = await SettingsPipeline.create({
      name: body.name,
      color: body.color,
      order: newOrder
    });

    return NextResponse.json({ success: true, data: newPipeline });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await connect();
    await SettingsPipeline.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}