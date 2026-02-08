import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/models/User";
import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connect();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

    if (jsonData.length === 0) {
      return NextResponse.json({ message: "File is empty" }, { status: 400 });
    }

    let successCount = 0;
    const defaultPassword = await bcrypt.hash("123456", 10);

    for (const row of jsonData) {
      const existingUser = await User.findOne({ email: row.email });
      
      if (!existingUser && row.email) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newStudentData: any = {
          name: `${row.firstName || ""} ${row.lastName || ""}`.trim(),
          email: row.email,
          phone: row.phone,
          country: row.country,
          password: defaultPassword,
          role: "student",
          status: "active",
          
          programPreference: {
            degree: row.programPreference || "Not Set",
            country: row.country || "Not Set"
          },
          
          notes: `Intake: ${row.intakePreference || "N/A"} - Imported via Bulk Upload`
        };

        await User.create(newStudentData);
        successCount++;
      }
    }

    return NextResponse.json({ 
      message: "Import processed successfully",
      count: successCount,
      total: jsonData.length
    });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Import Error:", error);
    return NextResponse.json({ message: "Import failed: " + error.message }, { status: 500 });
  }
}