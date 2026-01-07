import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  // Student Info
  studentEmail: { type: String, required: true },
  
  // Program Info (Apply ফর্মের সাথে নাম মিল রাখা হলো)
  universityName: { type: String, required: true },
  programName: { type: String, required: true }, // আগে 'course' ছিল, এখন 'programName'
  
  // Personal Info (Apply ফর্ম থেকে আসা ডাটা)
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  country: { type: String },
  intakePreference: { type: String },

  // Status
  status: { 
    type: String, 
    enum: ["Applied", "In Review", "Offer Received", "Conditional Offer", "Visa Processing", "Enrolled", "Rejected", "Waiting List"], 
    default: "Applied" 
  },
  appliedDate: { type: Date, default: Date.now },
  applicationId: { type: String },
  
  // Offer Details (Admin আপডেট করবে)
  scholarship: { type: String, default: "N/A" },
  tuitionFee: { type: String, default: "N/A" },
  expiryDate: { type: String, default: "N/A" },
  location: { type: String, default: "N/A" },
  duration: { type: String, default: "N/A" },
  startDate: { type: String, default: "N/A" },
  accommodation: { type: String, default: "Not specified" },
  workPermit: { type: String, default: "No" },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);