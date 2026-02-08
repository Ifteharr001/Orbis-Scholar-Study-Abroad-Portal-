import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  studentEmail: string;
  universityName: string;
  programName: string;
  
  // IDs
  universityId?: string;
  programId?: string;

  // Student Details
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  intakePreference?: string;
  
  status: string;
  priority: "high" | "medium" | "low"; 
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  counselor?: mongoose.Types.ObjectId | any;                 

  appliedDate: Date;
  applicationId?: string;
  
  scholarship: string;
  tuitionFee: string;
  expiryDate: string;
  location: string;
  duration: string;
  startDate: string;
  accommodation: string;
  workPermit: string;
  
  offerLetterUrl?: string;
  isOfferAccepted: boolean;
  offerAcceptedDate?: Date;

  internalNotes: {
    content: string;
    createdAt: Date;
    author?: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    studentEmail: { type: String, required: true },
    universityName: { type: String, required: true },
    programName: { type: String, required: true },

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
        "Inquiry", "Docs Pending", "Docs Verified", "Submitted", 
        "Offer Received", "Visa Processing", "Enrolled", "Rejected", 
        "Applied", "Pending", "In Review", "Conditional Offer", "Waiting List"
      ],
      default: "Applied",
    },

    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    counselor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    appliedDate: { type: Date, default: Date.now },
    applicationId: { type: String },

    scholarship: { type: String, default: "N/A" },
    tuitionFee: { type: String, default: "N/A" },
    expiryDate: { type: String, default: "N/A" },
    location: { type: String, default: "N/A" },
    duration: { type: String, default: "N/A" },
    startDate: { type: String, default: "N/A" },
    accommodation: { type: String, default: "Not specified" },
    workPermit: { type: String, default: "No" },

    offerLetterUrl: { type: String, default: "" }, 
    isOfferAccepted: { type: Boolean, default: false },
    offerAcceptedDate: { type: Date },

    internalNotes: [
      {
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
        author: { type: String, default: "Admin" }
      }
    ],
  },
  { timestamps: true }
);

const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;