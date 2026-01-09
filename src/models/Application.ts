import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  studentEmail: string;
  universityName: string;
  programName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  intakePreference?: string;
  status: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    // Student Info
    studentEmail: { type: String, required: true },

    // Program Info
    universityName: { type: String, required: true },
    programName: { type: String, required: true },

    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    country: { type: String },
    intakePreference: { type: String },

    status: {
      type: String,
      enum: [
        "Applied",
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


ApplicationSchema.index({ studentEmail: 1 });

// ৩. মডেল এক্সপোর্ট (Next.js এর জন্য সেফ প্যাটার্ন)
const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;