import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  universityName: { type: String, required: true },
  course: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Applied", "In Review", "Offer Received", "Conditional Offer", "Visa Processing", "Enrolled", "Rejected", "Waiting List"], 
    default: "Applied" 
  },
  appliedDate: { type: Date, default: Date.now },
  applicationId: { type: String },
  
  // ✅ নতুন ফিল্ডস (Offers & Scholarships এর জন্য)
  scholarship: { type: String, default: "N/A" },
  tuitionFee: { type: String, default: "N/A" },
  expiryDate: { type: String, default: "N/A" },
  location: { type: String, default: "N/A" },
  duration: { type: String, default: "N/A" },
  startDate: { type: String, default: "N/A" },
  accommodation: { type: String, default: "Not specified" },
  workPermit: { type: String, default: "No" },
});

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);