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
  
  // ✅ এই ফিল্ডটি মিসিং ছিল, এখন যোগ করা হলো (Profile Page এর জন্য জরুরি)
  programPreference?: string; 

  // 👇 Student-এর জন্য
  assignedCounselor?: mongoose.Types.ObjectId;

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
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
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

    // ✅ নতুন ফিল্ড যোগ করা হলো
    programPreference: { 
      type: String, 
      default: "Masters" 
    },

    // ১. স্টুডেন্টকে কাউন্সিলরের সাথে লিংক করার জন্য
    assignedCounselor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ২. কাউন্সিলর প্রোফাইল ডাটা
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

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;