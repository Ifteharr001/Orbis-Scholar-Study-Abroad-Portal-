import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connect();
    console.log("--- SEEDING STARTED ---");

    const email = "admin@techbybee.com";
    const password = "123";

    const deleted = await User.findOneAndDelete({ email });
    if (deleted) {
      console.log("Old Admin Deleted");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "owner", 
      status: "active",
      phone: "01700000000",
      country: "Bangladesh"
    });

    console.log("--- SEED SUCCESS: Admin Created ---");
    console.log("Email:", newAdmin.email);
    console.log("Role:", newAdmin.role);

    return NextResponse.json({ 
      message: "Admin Created Successfully", 
      email: email,
      password: password 
    });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("SEED ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}