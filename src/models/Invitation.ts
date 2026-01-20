import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvitation extends Document {
  email: string;
  role: "admin" | "counselor" | "staff" | "owner";
  token: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,     
    },
    role: {
      type: String,
      enum: ["admin", "counselor", "staff", "owner"], 
      required: [true, "Role is required"],
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

export const Invitation: Model<IInvitation> =
  mongoose.models.Invitation || mongoose.model<IInvitation>("Invitation", invitationSchema);

export default Invitation;