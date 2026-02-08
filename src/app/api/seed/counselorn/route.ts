import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connect();
    console.log("--- COUNSELOR SEEDING STARTED ---");

    const email = "counselor@techbybee.com";
    const password = "123";

    await User.findOneAndDelete({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCounselor = await User.create({
      name: "Demo Counselor",
      email: email,
      password: hashedPassword,
      role: "counselor", 
      status: "active",
      phone: "01711111111",
      country: "Bangladesh",
      
      bio: "I am an expert counselor with 5 years of experience in Study Abroad.",
      specializations: ["Visa Processing", "Scholarship", "University Selection"],
      availability: "Mon-Fri, 10 AM - 6 PM",
      experience: "5 Years",
      totalStudents: 120,
      successRate: 98,
      rating: 4.8
    });

    console.log("--- SEED SUCCESS: Counselor Created ---");
    console.log("Email:", newCounselor.email);
    console.log("Role:", newCounselor.role);

    return NextResponse.json({ 
      message: "Counselor Created Successfully", 
      email: email,
      password: password,
      role: "counselor"
    });
    

  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("SEED ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}