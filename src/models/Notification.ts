import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["urgent", "info", "success", "alert"], default: "info" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);