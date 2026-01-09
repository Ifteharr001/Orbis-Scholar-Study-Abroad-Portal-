import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import University, { IUniversity, IScholarship } from "@/models/University";

export async function GET() {
  try {
    await connect();

    // ১. অপটিমাইজড কুয়েরি
    // আমরা 'slug' এবং 'logo' সিলেক্ট করছি যাতে ফ্রন্টএন্ডে সুন্দর কার্ড এবং লিংক বানানো যায়
    const universities = await University.find({})
      .select("name slug location scholarships logo") 
      .lean();

    // ২. ডাটা ট্রান্সফর্মেশন (TypeScript এর সাহায্যে)
    const allScholarships = universities.flatMap((uni) => {
      // lean() ব্যবহার করায় এটি সাধারণ JS অবজেক্ট, তাই টাইপ বলে দিচ্ছি
      const u = uni as unknown as IUniversity; 

      if (!u.scholarships || u.scholarships.length === 0) return [];

      return u.scholarships.map((sch: IScholarship, index: number) => ({
        id: `${u._id}-${index}`, // ইউনিক কি (Unique Key) জেনারেট করা হলো
        
        // ইউনিভার্সিটি ইনফো
        universityId: u._id,
        universityName: u.name,
        universitySlug: u.slug, // 🚀 লিংকিং এর জন্য জরুরি
        location: u.location,
        logo: u.logo || "/placeholder-logo.png", // লোগো না থাকলে প্লেসহোল্ডার

        // স্কলারশিপ ডিটেইলস
        program: sch.name,        
        degree: sch.type,         // যেমন: Bachelor, Master
        language: "English",      // এটি যদি মডেলে না থাকে, হার্ডকোড ঠিক আছে
        
        // ফিনান্সিয়াল ইনফো
        tuitionFee: sch.tuitionFee,
        accommodationFee: sch.accommodationFee,
        scholarshipType: sch.type, // যেমন: Full Free, Partial
        
        // বাড়তি সুবিধা (যদি থাকে)
        monthlyStipend: sch.monthlyStipend || "N/A",
        yearlyStipend: sch.yearlyStipend || "N/A",
      }));
    });

    return NextResponse.json(allScholarships);
  } catch (error) {
    console.error("Scholarship API Error:", error); // সার্ভার কনসোলে এরর দেখার জন্য
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}