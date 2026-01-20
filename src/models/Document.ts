import mongoose, { Schema, Document, Model } from "mongoose";

// ১. TypeScript Interface
export interface IDocument extends Document {
  applicationId: string; // ✅ এটি যোগ করা হয়েছে যাতে অ্যাপ্লিকেশনের সাথে লিংক করা যায়
  studentEmail: string;
  name: string;          // ডকুমেন্টের টাইপ (যেমন: Passport)
  fileName: string;      // ফাইলের নাম
  fileUrl: string;       // S3 বা Cloudinary লিংক
  status: "Pending" | "Verified" | "Rejected";
  category: "required" | "optional" | "rejected";
  feedback?: string;     // রিজেক্ট হলে কারণ
  uploadedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    applicationId: { type: String, required: true }, // ✅ এটি খুবই জরুরি (Admin Panel এর জন্য)
    studentEmail: { type: String, required: true },
    
    name: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    
    category: {
      type: String,
      enum: ["required", "optional", "rejected"],
      default: "required",
    },
    
    feedback: { type: String }, // Optional
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 🚀 ২. ইনডেক্সিং (Indexing) - পারফরম্যান্সের জন্য

// নির্দিষ্ট অ্যাপ্লিকেশনের ডকুমেন্ট দ্রুত খোঁজার জন্য
DocumentSchema.index({ applicationId: 1 });

// স্টুডেন্ট তার সব ডকুমেন্ট যাতে দ্রুত পায়
DocumentSchema.index({ studentEmail: 1 });

// অ্যাডমিন প্যানেলে স্ট্যাটাস ফিল্টার করার জন্য
DocumentSchema.index({ status: 1 });

// ৩. মডেল এক্সপোর্ট
const Documents: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);

export default Documents;