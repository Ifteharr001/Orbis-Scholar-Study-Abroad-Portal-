import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "student" | "partner" | "admin" | "counselor";
  phone?: string;
  gender?: string;
  country?: string;
  image?: string;
  
  // Profile info (Student)
  programPreference?: string; 

  // 👇 Student-এর জন্য (Link to Counselor)
  // নোট: API-তে populate("counselor") ব্যবহার করায় এখানে নাম 'counselor' রাখা হয়েছে
  counselor?: mongoose.Types.ObjectId;

  // 👇 Counselor-এর জন্য
  bio?: string;
  specializations?: string[];
  languages?: string[];
  availability?: string;
  experience?: string;
  totalStudents?: number;
  successRate?: number;
  rating?: number;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Unique হওয়ার কারণে MongoDB অটোমেটিক ইনডেক্স তৈরি করে নেয়
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // 🔒 নিরাপত্তা: সাধারণ কুয়েরিতে পাসওয়ার্ড ফিল্ড হাইড থাকবে
    },
    role: {
      type: String,
      enum: ["student", "partner", "admin", "counselor"],
      default: "student",
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },

    // Student Specific
    programPreference: { 
      type: String, 
      default: "Masters" 
    },

    // 🔗 Relationship: স্টুডেন্ট -> কাউন্সিলর
    // নাম 'counselor' রাখা হয়েছে যাতে Dashboard API এর populate("counselor") কাজ করে
    counselor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Counselor Specific Data
    bio: { type: String, default: "" },
    specializations: { type: [String], default: [] },
    languages: { type: [String], default: ["English"] },
    availability: { type: String, default: "Mon - Fri, 9 AM - 5 PM" },
    experience: { type: String, default: "0 years" },
    totalStudents: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
  },
  {
    timestamps: true,
  }
);

// 🚀 Performance Indexing (খুবই গুরুত্বপূর্ণ)

// ১. কাউন্সিলর ড্যাশবোর্ডের জন্য (কাউন্সিলর তার স্টুডেন্টদের এক ক্লিকে পাবে)
UserSchema.index({ counselor: 1 });

// ২. রোল ফিল্টার করার জন্য (যেমন: সব কাউন্সিলর বা সব পার্টনার খোঁজা)
UserSchema.index({ role: 1 });

// ৩. ❌ Email index রিমুভ করা হয়েছে কারণ উপরে unique: true আছে

// Next.js এ Hot Reload এর কারণে মডেল ওভাররাইট এরর আটকাতে এই লজিক
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;