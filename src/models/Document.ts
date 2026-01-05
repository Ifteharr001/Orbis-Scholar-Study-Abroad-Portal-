import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  name: { type: String, required: true }, // যেমন: Passport, CV
  fileName: { type: String, required: true }, // ফাইলের নাম
  fileUrl: { type: String, required: true }, // ক্লাউড বা লোকাল স্টোরেজ লিংক
  status: { 
    type: String, 
    enum: ["Pending", "Verified", "Rejected"], 
    default: "Pending" 
  },
  category: { type: String, enum: ["required", "optional", "rejected"], default: "required" },
  feedback: { type: String }, // রিজেক্ট হলে ফিডব্যাক থাকবে
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);