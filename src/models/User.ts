import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  // 👇 ১. রোল আপডেট করা হয়েছে (staff ও owner যোগ করা হয়েছে)
  role: "student" | "partner" | "admin" | "counselor" | "staff" | "owner";
  
  // 👇 ২. স্ট্যাটাস ফিল্ড যোগ করা হয়েছে (এটি মিসিং ছিল)
  status: "active" | "inactive" | "blocked";

  // Profile info
  phone?: string;
  gender?: string;
  country?: string;
  image?: string;
  
  // Profile info (Student Specific)
  programPreference?: string; 

  // Link to Counselor
  counselor?: mongoose.Types.ObjectId;

  // Counselor Specific
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
      required: false,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      // 👇 Enum আপডেট: staff ও owner যোগ করা হলো
      enum: ["student", "partner", "admin", "counselor", "staff", "owner"],
      default: "student",
    },
    // 👇 নতুন স্ট্যাটাস স্কিমা যোগ করা হলো
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    phone: {
      type: String,
      default: "", 
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },

    // Student Specific
    programPreference: { 
      type: String, 
      default: "Masters" 
    },

    // Relationship
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

// Indexes
UserSchema.index({ counselor: 1 });
UserSchema.index({ role: 1 });

// Model Creation
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;