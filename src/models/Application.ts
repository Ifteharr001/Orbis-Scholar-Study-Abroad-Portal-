import mongoose, { Schema, Document, Model } from "mongoose";

// ১. ইন্টারফেস আপডেট (TypeScript এর জন্য)
export interface IApplication extends Document {
  studentEmail: string;
  universityName: string;
  programName: string;
  
  // ✅ নতুন ফিল্ড যোগ করা হলো (Error ফিক্স করার জন্য)
  universityId?: string;
  programId?: string;

  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  intakePreference?: string;
  
  status: string;
  appliedDate: Date;
  applicationId?: string;
  
  // Offer Details
  scholarship: string;
  tuitionFee: string;
  expiryDate: string;
  location: string;
  duration: string;
  startDate: string;
  accommodation: string;
  workPermit: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ২. স্কিমা আপডেট (MongoDB এর জন্য)
const ApplicationSchema = new Schema<IApplication>(
  {
    // Student Info
    studentEmail: { type: String, required: true },

    // Program Info
    universityName: { type: String, required: true },
    programName: { type: String, required: true },

    // ✅ ডাটাবেস ফিল্ড যোগ করা হলো
    universityId: { type: String },
    programId: { type: String },

    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    country: { type: String },
    intakePreference: { type: String },

    status: {
      type: String,
      enum: [
        "Applied", // অথবা "Pending" যদি আগের কোডে Pending ব্যবহার করে থাকেন
        "Pending", // দুটোর যে কোনো একটি বা দুটোই রাখতে পারেন সেইফটির জন্য
        "In Review",
        "Offer Received",
        "Conditional Offer",
        "Visa Processing",
        "Enrolled",
        "Rejected",
        "Waiting List",
      ],
      default: "Applied",
    },
    appliedDate: { type: Date, default: Date.now },
    applicationId: { type: String },

    // Offer Details
    scholarship: { type: String, default: "N/A" },
    tuitionFee: { type: String, default: "N/A" },
    expiryDate: { type: String, default: "N/A" },
    location: { type: String, default: "N/A" },
    duration: { type: String, default: "N/A" },
    startDate: { type: String, default: "N/A" },
    accommodation: { type: String, default: "Not specified" },
    workPermit: { type: String, default: "No" },
  },
  { timestamps: true }
);

// ইনডেক্সিং (দ্রুত সার্চের জন্য)
ApplicationSchema.index({ studentEmail: 1 });

// ৩. মডেল এক্সপোর্ট (Next.js এর জন্য সেফ প্যাটার্ন)
const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;