import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connect } from "@/lib/db";
import Application from "@/models/Application";
import University from "@/models/University"; 

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized: Please login first" },
        { status: 401 }
      );
    }

    await connect();
    const email = session.user.email;

    const applications = await Application.find({ 
        studentEmail: email,
        status: { 
            $in: ["Offer Received", "Visa Processing", "Enrolled", "Conditional Offer"] 
        } 
    })
    .populate({
        path: "universityId",
        model: University, 
        select: "name location programs image logo", 
    })
    .sort({ updatedAt: -1 })
    .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enrichedApplications = applications.map((app: any) => {
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const programDetails = app.universityId?.programs?.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (p: any) => p.name === app.programName
        );

        return {
            ...app,
            location: app.location || app.universityId?.location || "N/A",
            tuitionFee: app.tuitionFee || programDetails?.tuitionFee || "N/A",
            duration: app.duration || programDetails?.duration || "N/A",
            accommodation: app.accommodation || programDetails?.accommodationFee || "Available",
            
            scholarship: app.scholarshipName || (programDetails?.hasScholarship ? "Available" : "None"),
            
            universityImage: app.universityId?.image,
            universityLogo: app.universityId?.logo
        };
    });

    return NextResponse.json({ 
      success: true, 
      data: enrichedApplications 
    }, { status: 200 });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Fetch Offers Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { message: "Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { applicationId } = await req.json();
        
        if (!applicationId) {
            return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
        }

        await connect();

        const updatedApp = await Application.findOneAndUpdate(
            { 
                _id: applicationId, 
                studentEmail: session.user.email 
            },
            {
                status: "Visa Processing", 
                isOfferAccepted: true,     
                offerAcceptedDate: new Date()
            },
            { new: true }
        );

        if (!updatedApp) {
            return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Offer accepted successfully! Visa processing started.",
            data: updatedApp
        });

    } catch (error) {
        console.error("Accept Offer Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}