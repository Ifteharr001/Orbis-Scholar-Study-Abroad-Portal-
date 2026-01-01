import { connect } from "@/lib/db";
import University from "@/models/University";
import UniversityDetailsPage from "./UniversityDetailsPage";

// ডাটাবেস থেকে ডাটা আনার ফাংশন
async function getUniversity(id: string) {
  try {
    await connect();
    const university = await University.findById(id).lean();
    if (!university) return null;
    
    // MongoDB অবজেক্ট এবং ডেট সিরিয়ালাইজ করার জন্য
    return JSON.parse(JSON.stringify(university));
  } catch (error) {
    console.error("Error fetching university details:", error);
    return null;
  }
}

// এটি মেইন পেজ যা ব্রাউজারে লোড হবে
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const universityData = await getUniversity(id);

  if (!universityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-destructive">University Not Found</h1>
      </div>
    );
  }

  // ডাটা পাওয়া গেলে ক্লায়েন্ট কম্পোনেন্টে পাস করা হচ্ছে
  return <UniversityDetailsPage universityData={universityData} />;
}