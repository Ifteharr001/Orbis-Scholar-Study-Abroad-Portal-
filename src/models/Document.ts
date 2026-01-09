import mongoose, { Schema, Document, Model } from "mongoose";

// ১. TypeScript Interface (টাইপ সেফটির জন্য)
export interface IDocument extends Document {
  studentEmail: string;
  name: string;      // ডকুমেন্টের নাম (যেমন: Passport)
  fileName: string;  // আসল ফাইলের নাম (যেমন: passport_scan.pdf)
  fileUrl: string;   // S3 বা Cloudinary লিংক
  status: "Pending" | "Verified" | "Rejected";
  category: "required" | "optional" | "rejected";
  feedback?: string; // রিজেক্ট হলে কারণ
  uploadedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
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
    
    feedback: { type: String }, // এটি optional, তাই required দেওয়া হয়নি
    uploadedAt: { type: Date, default: Date.now },
  }
);

// 🚀 ২. ইনডেক্সিং (Indexing) - ড্যাশবোর্ড ফাস্ট করার জন্য

// স্টুডেন্ট ড্যাশবোর্ডের জন্য (স্টুডেন্ট তার সব ডকুমেন্ট দ্রুত দেখতে পাবে)
DocumentSchema.index({ studentEmail: 1 });

// অ্যাডমিন বা Docs টিমের জন্য (তারা দ্রুত 'Pending' বা 'Rejected' ফাইল খুঁজে পাবে)
DocumentSchema.index({ status: 1 });

// ৩. মডেল এক্সপোর্ট
const Documents: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);

export default Documents;