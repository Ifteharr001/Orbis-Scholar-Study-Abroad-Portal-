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
    
    type: { 
      type: String, 
      enum: ["urgent", "info", "success", "alert"], 
      default: "info" 
    },
    
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true } 
);


NotificationSchema.index({ studentEmail: 1, isRead: 1 });

NotificationSchema.index({ createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;