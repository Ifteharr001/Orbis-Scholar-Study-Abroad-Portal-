import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Appointment from "@/models/Appointment";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connect();

    const counselor = await User.findOne({ email: session.user.email }).select("_id");
    if (!counselor) return NextResponse.json({ error: "Counselor not found" }, { status: 404 });

    const appointments = await Appointment.find({ counselorId: counselor._id })
      .populate("studentId", "name email image") 
      .sort({ date: 1 })
      .lean();

    return NextResponse.json({ success: true, appointments });

  } catch (error) {
    console.error("Counselor Appointment API Error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status } = await req.json(); 

    if (!["approved", "rejected", "completed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connect();

    const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
    );

    return NextResponse.json({ success: true, appointment: updatedAppointment });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}