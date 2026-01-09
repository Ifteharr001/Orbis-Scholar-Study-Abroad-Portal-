import mongoose, { Schema, Document, Model } from "mongoose";

// ১. TypeScript Interface
export interface INotification extends Document {
  studentEmail: string;
  message: string;
  type: "urgent" | "info" | "success" | "alert";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    studentEmail: { type: String, required: true },
    message: { type: String, required: true },
    
    // UI তে কালার দেখানোর জন্য টাইপগুলো ফিক্সড রাখা হলো
    type: { 
      type: String, 
      enum: ["urgent", "info", "success", "alert"], 
      default: "info" 
    },
    
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true } // এটি অটোমেটিক createdAt এবং updatedAt ফিল্ড তৈরি করবে
);

// 🚀 ২. ইনডেক্সিং (Indexing) - ড্যাশবোর্ড ফাস্ট করার জন্য

// Compound Index: ড্যাশবোর্ডে আমরা 'studentEmail' এবং 'isRead' একসাথে চেক করছি
// তাই এই দুটি মিলিয়ে ইনডেক্স করলে কুয়েরি সবথেকে ফাস্ট হবে।
NotificationSchema.index({ studentEmail: 1, isRead: 1 });

// সর্টিং এর জন্য (যাতে লেটেস্ট নোটিফিকেশন আগে আসে)
NotificationSchema.index({ createdAt: -1 });

// ৩. মডেল এক্সপোর্ট
const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;