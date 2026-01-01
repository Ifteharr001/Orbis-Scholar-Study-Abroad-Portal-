import mongoose, { Schema, Document, Model } from "mongoose";

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
    timestamps: true, 
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;