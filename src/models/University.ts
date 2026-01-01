import mongoose, { Schema, Document } from "mongoose";

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

interface IFees {
  bachelor?: IFeeStructure;
  master?: IFeeStructure;
  phd?: IFeeStructure;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}

export interface IUniversity extends Document {
  name: string;
  location: string;
  country?: string;
  heroImage?: string;
  image?: string;
  logo?: string;
  ranking?: string;
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
  gallery?: string[];
  galleryVideos?: IGalleryVideo[];
}

const UniversitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    country: { type: String },
    heroImage: { type: String },
    image: { type: String },
    logo: { type: String },
    ranking: { type: String },
    deadline: { type: String },
    rating: { type: Number },
    about: { type: String },
    founded: { type: Number },
    studentPopulation: { type: Number },
    acceptanceRate: { type: String },
    tuitionFee: { type: String },
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

    fees: { type: Object }, 
    requiredDocuments: [String],

    faqs: [
      {
        question: String,
        answer: String,
      }
    ],

    galleryImages: [String],
    gallery: [String],
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


if (mongoose.models.University) {
  delete mongoose.models.University;
}

const University = mongoose.model<IUniversity>("University", UniversitySchema);
export default University;