import mongoose, { Schema, Document, Model } from "mongoose";

// --- Sub-Interfaces (Type Safety) ---

export interface IProgram {
  id?: number;
  name: string;
  degree: string;
  language: string;
  duration: string;
  tuitionFee: string;
  accommodationFee: string;
  hasScholarship: boolean;
}

export interface IScholarship {
  name: string;
  type: string;
  tuitionFee: string;
  accommodationFee: string;
  insuranceFee: string;
  monthlyStipend: string;
  yearlyStipend: string;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface IGalleryVideo {
  thumbnail: string;
  title: string;
  duration: string;
}

interface IFeeStructure {
  tuition: string;
  accommodation: string;
  insurance: string;
  visaExtension: string;
  medical: string;
}

// Fees এর জন্য নির্দিষ্ট স্ট্রাকচার (any বাদ দেওয়া হয়েছে)
interface IFees {
  bachelor?: IFeeStructure;
  master?: IFeeStructure;
  phd?: IFeeStructure;
}

// --- Main Interface ---

export interface IUniversity extends Document {
  name: string;
  slug: string; // 🚀 SEO URL এর জন্য (যেমন: nanjing-university)
  location: string;
  country?: string;
  heroImage?: string;
  image?: string;
  logo?: string;
  ranking?: number; // String থেকে Number করা হলো (Sort করার সুবিধার জন্য)
  deadline?: string;
  daysLeft?: number;
  rating?: number;
  about?: string;
  founded?: number;
  studentPopulation?: number;
  acceptanceRate?: string;
  tuitionFee?: string;
  applicationFee?: string;
  
  programs?: IProgram[];        
  aboutText?: string;
  accommodationText?: string;
  scholarships?: IScholarship[]; 
  fees?: IFees;                 
  requiredDocuments?: string[];
  faqs?: IFAQ[];
  galleryImages?: string[];     
  galleryVideos?: IGalleryVideo[];
  
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema Definition ---

const UniversitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true },
    
    // 🚀 SEO Friendly URL Slug (Must be unique)
    slug: { type: String, required: true, unique: true },

    location: { type: String, required: true },
    country: { type: String, required: true }, // Country ছাড়া ফিল্টার করা কঠিন, তাই required
    
    heroImage: { type: String },
    image: { type: String },
    logo: { type: String },
    
    // Ranking কে Number হিসেবে রাখলে sorting সহজ হয় (যেমন: Rank 1 to 10)
    // ইনপুট নেওয়ার সময় স্ট্রিং আসলেও কনভার্ট করে নিবেন
    ranking: { type: Number }, 

    deadline: { type: String },
    rating: { type: Number, default: 0 },
    about: { type: String },
    founded: { type: Number },
    studentPopulation: { type: Number },
    acceptanceRate: { type: String },
    tuitionFee: { type: String }, // Average cost दिखानेর জন্য
    applicationFee: { type: String },
    
    // Programs Array
    programs: [
      {
        id: { type: Number },
        name: { type: String },
        degree: { type: String },
        language: { type: String },
        duration: { type: String },
        tuitionFee: { type: String },
        accommodationFee: { type: String },
        hasScholarship: { type: Boolean },
      },
    ],
    
    aboutText: String,
    accommodationText: String,

    // Scholarships Array 
    scholarships: [
      {
        name: { type: String },
        type: { type: String },
        tuitionFee: { type: String },
        accommodationFee: { type: String },
        insuranceFee: { type: String },
        monthlyStipend: { type: String },
        yearlyStipend: { type: String },
      }
    ],

    // Fees Object (Schema Validation)
    // আগে 'Object' ছিল, এখন ডিটেইলস দেওয়া হলো যাতে ভুল ডাটা না ঢুকে
    fees: {
       bachelor: { type: Object }, // বা এখানেও নেস্টেড স্কিমা দিতে পারেন
       master: { type: Object },
       phd: { type: Object }
    },

    requiredDocuments: [String],

    faqs: [
      {
        question: String,
        answer: String,
      }
    ],

    galleryImages: [String],
    galleryVideos: [
      {
        thumbnail: String,
        title: String,
        duration: String,
      }
    ],
  },
  { timestamps: true }
);

// 🚀 Performance Indexing (খুবই গুরুত্বপূর্ণ)

// ১. নাম দিয়ে সার্চ করার জন্য (Text Index)
// এটি "Nanjing" লিখলেই "Nanjing University" খুঁজে দিবে
UniversitySchema.index({ name: "text" }); 

// ২. স্লাগ দিয়ে পেজ লোড করার জন্য
UniversitySchema.index({ slug: 1 });

// ৩. ফিল্টার করার জন্য (কান্ট্রি এবং র‍্যাঙ্কিং)
UniversitySchema.index({ country: 1 });
UniversitySchema.index({ ranking: 1 });

// Model Export Pattern for Next.js
const University: Model<IUniversity> = mongoose.models.University || mongoose.model<IUniversity>("University", UniversitySchema);

export default University;