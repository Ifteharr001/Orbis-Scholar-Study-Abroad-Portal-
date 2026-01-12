import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // ✅ ইমেইল সবসময় ছোট হাতের হবে
      trim: true,      // ✅ স্পেস রিমুভ করবে
    },
    role: {
      type: String,
      // 👇 User মডেলের সাথে মিল রেখে এগুলো lowercase করা হলো
      enum: ["admin", "counselor", "staff", "owner"], 
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Invitation =
  mongoose.models.Invitation || mongoose.model("Invitation", invitationSchema);