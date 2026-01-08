import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connect();
    const services = await Service.find().sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();
    const newService = await Service.create(body);
    return NextResponse.json(newService, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) { 
   
    console.error("Error creating service:", error); 
    return NextResponse.json({ error: error.message || "Failed to create service" }, { status: 500 });
  }
}