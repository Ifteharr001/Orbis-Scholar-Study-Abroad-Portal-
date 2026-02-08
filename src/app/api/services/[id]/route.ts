import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Service from "@/models/Service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connect();

    const { id } = await params;
    const service = await Service.findOne({ slug: id }).lean();
    
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json(service);

  } catch (error) {
    console.error("Fetch Service Detail Error:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}