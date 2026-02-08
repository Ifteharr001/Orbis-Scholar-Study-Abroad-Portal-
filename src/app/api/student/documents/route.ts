import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Documents from "@/models/Document";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const docs = await Documents.find({ studentEmail: session.user.email })
      .sort({ uploadedAt: -1 })
      .lean();

    return NextResponse.json(docs);
  } catch (error) {
    console.error("Fetch Documents Error:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    const { name, fileName, fileUrl, category } = body; 

    
    if (!name || !fileName || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connect();

    const doc = await Documents.findOneAndUpdate(
      { studentEmail: session.user.email, name: name }, 
      {
        $set: {
          fileName,
          fileUrl, 
          category: category || "required",
          status: "Pending", 
          feedback: "", 
          uploadedAt: new Date(),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(doc, { status: 201 });

  } catch (error) {
    console.error("Upload Document Error:", error);
    return NextResponse.json({ error: "Failed to save document info" }, { status: 500 });
  }
}