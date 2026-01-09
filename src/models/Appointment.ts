import mongoose, { Schema, Document, Model } from "mongoose";

// ১. TypeScript Interface (টাইপ সেফটির জন্য)
export interface IAppointment extends Document {
  studentEmail: string;
  counselorId: mongoose.Types.ObjectId; // রেফারেন্স হিসেবে ObjectId থাকবে
  topic: string;
  type: "video" | "in-person";
  date: Date;
  time: string;
  duration: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  meetingLink?: string;
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    studentEmail: { type: String, required: true },
    counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    type: { type: String, enum: ["video", "in-person"], required: true },
    
    // Date অবজেক্ট হিসেবে রাখাই ভালো, এতে sort করা সহজ হয়
    date: { type: Date, required: true }, 
    time: { type: String, required: true },
    duration: { type: String, default: "30 mins" },
    
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
    meetingLink: { type: String },
    createdAt: { type: Date, default: Date.now },
  }
);

// 🚀 ২. পারফর্ম্যান্স অপটিমাইজেশন (Indexing)
// স্টুডেন্ট ড্যাশবোর্ডের জন্য ফাস্ট সার্চ
AppointmentSchema.index({ studentEmail: 1 });

// কাউন্সিলর ড্যাশবোর্ডের জন্য ফাস্ট সার্চ
AppointmentSchema.index({ counselorId: 1 });

// ডেট অনুযায়ী সর্টিং ফাস্ট করার জন্য (Upcoming Appointments আগে দেখানোর জন্য)
AppointmentSchema.index({ date: -1 });

// ৩. মডেল এক্সপোর্ট
const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;