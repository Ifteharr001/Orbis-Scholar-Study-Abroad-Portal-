import { connect } from "@/lib/db";
import University from "@/models/University";
import UniversityDetailsPage from "@/app/(site)/university/UniversityDetailsPage";
import { isValidObjectId } from "mongoose";

async function getUniversity(identifier: string) {
  try {
    await connect();
    
    const decodedId = decodeURIComponent(identifier);
    let university = null;

    if (isValidObjectId(decodedId)) {
      university = await University.findById(decodedId).lean();
    }

    if (!university) {
      university = await University.findOne({ 
        slug: decodedId.toLowerCase()
      }).lean();
    }

    if (!university) return null;
    
    return JSON.parse(JSON.stringify(university));
  } catch (error) {
    console.error("Error fetching university details:", error);
    return null;
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
     return <div>Invalid URL Parameter</div>;
  }

  const universityData = await getUniversity(id);

  if (!universityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-destructive">University Not Found</h1>
      </div>
    );
  }

  return <UniversityDetailsPage universityData={universityData} />;
}