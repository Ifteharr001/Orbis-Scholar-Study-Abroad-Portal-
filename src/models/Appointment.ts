import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  studentId: mongoose.Types.ObjectId; 
  studentEmail: string;
  counselorId: mongoose.Types.ObjectId;
  topic: string;
  type: "video" | "in-person";
  date: Date;
  time: string;
  duration: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled"; 
  notes?: string;
  meetingLink?: string;
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    studentEmail: { type: String, required: true },
    counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    topic: { type: String, required: true },
    type: { type: String, enum: ["video", "in-person"], required: true },
    
    date: { type: Date, required: true }, 
    time: { type: String, required: true },
    duration: { type: String, default: "30 mins" },
    
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"], 
      default: "pending",
    },
    notes: { type: String },
    meetingLink: { type: String },
    createdAt: { type: Date, default: Date.now },
  }
);

AppointmentSchema.index({ studentEmail: 1 });
AppointmentSchema.index({ counselorId: 1 });
AppointmentSchema.index({ date: -1 });

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;