import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  type: { type: String, enum: ["video", "in-person"], required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: String, default: "30 mins" },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "completed", "cancelled"], 
    default: "pending" 
  },
  notes: { type: String },
  meetingLink: { type: String }, // ভিডিও কলের লিংকের জন্য
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);