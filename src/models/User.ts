import mongoose, { Schema, Document, Model } from "mongoose";

// ১. টাইপস্ক্রিপ্ট ইন্টারফেস (যাতে আপনি ইন্টেলিসেন্স পান)
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "student" | "partner" | "admin";
  phone?: string;
  gender?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ২. স্কিমা ডেফিনিশন
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true, // নামের আগে-পিছে স্পেস থাকলে রিমুভ করবে
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // ডুপ্লিকেট ইমেইল আটকাবে
      trim: true,
      lowercase: true, // ইমেইল অটোমেটিক ছোট হাতের অক্ষরে সেভ হবে
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["student", "partner", "admin"],
      default: "student",
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    gender: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // এটি অটোমেটিক 'createdAt' এবং 'updatedAt' তৈরি করবে
  }
);

// ৩. মডেল এক্সপোর্ট (Next.js এ মডেল রিক্রিয়েশন এরর আটকানোর জন্য চেক করা হয়)
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;