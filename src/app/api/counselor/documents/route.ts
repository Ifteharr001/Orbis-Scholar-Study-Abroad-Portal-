import { NextResponse } from "next/server";
import { connect } from "@/lib/db"; 
import Document from "@/models/Document"; 
import User from "@/models/User"; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("studentId"); 

    console.log("--- DOCUMENT API STARTED ---");
    console.log("Searching for ID:", id);

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await connect();

    let query = {};

    
    const student = await User.findById(id).select("email");

    if (student && student.email) {
        console.log(" Found Student Profile:", student.email);
        
       
        query = {
            $or: [
                { studentEmail: student.email }, 
                { applicationId: id },           
                { studentId: id }               
            ]
        };
    } else {
        console.log("⚠️ Student not found via ID. Assuming ID is Application ID.");
        query = { applicationId: id };
    }

    const documents = await Document.find(query).sort({ uploadedAt: -1 });
    
    console.log(`Found ${documents.length} documents.`);

    return NextResponse.json(documents);

  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("🔥 Document API Error:", error);
    return NextResponse.json([], { status: 200 }); 
  }
}