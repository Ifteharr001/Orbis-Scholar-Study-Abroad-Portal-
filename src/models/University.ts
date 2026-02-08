import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProgram {
  id?: number;
  name: string;
  degree: string;
  language: string;
  duration: string;
  tuitionFee: string;
  accommodationFee: string;
  hasScholarship: boolean;
  
  intakes?: string[]; 
    deadline?: string;  
}

export interface IScholarship {
  name: string;
  type: string;
  tuitionFee: string;
  accommodationFee: string;
  insuranceFee: string;
  monthlyStipend: string;
  yearlyStipend: string;
  applicablePrograms?: string[];
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
}


export interface IUniversity extends Document {
  name: string;
  slug: string; 
  location: string;
  country?: string;
  heroImage?: string;
  image?: string;
  logo?: string;
  ranking?: number;
  
  deadline?: string;
  intakes?: string[]; 
  
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

const UniversitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true },
    
    slug: { type: String, required: true, unique: true },

    location: { type: String, required: true },
    country: { type: String, required: true },
    
    heroImage: { type: String },
    image: { type: String },
    logo: { type: String },
    
    ranking: { type: Number }, 

    deadline: { type: String }, 
    intakes: [String], 

    rating: { type: Number, default: 0 },
    about: { type: String },
    founded: { type: Number },
    studentPopulation: { type: Number },
    acceptanceRate: { type: String },
    tuitionFee: { type: String }, 
    applicationFee: { type: String },
    
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
        
        intakes: [String], 
        deadline: { type: String } 
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
        applicablePrograms: [{ type: String }]
      }
    ],

    // Fees Object
    fees: {
       bachelor: { type: Object },
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


UniversitySchema.index({ name: "text" }); 
UniversitySchema.index({ slug: 1 });
UniversitySchema.index({ country: 1 });
UniversitySchema.index({ ranking: 1 });

const University: Model<IUniversity> = mongoose.models.University || mongoose.model<IUniversity>("University", UniversitySchema);

export default University;