import mongoose from "mongoose";

const VisaProcessSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true, unique: true },
  
  // Progress Percentage (0-100)
  progress: { type: Number, default: 0 },
  
  // Task List
  tasks: [
    {
      id: Number,
      name: String,
      status: { type: String, enum: ["done", "pending", "locked", "verified"], default: "locked" },
      auto: Boolean,
      hasLink: Boolean,
      hasUpload: Boolean,
      fileUrl: String, // আপলোড করা ফাইলের লিংক
      fileName: String // ফাইলের নাম
    }
  ],

  // Appointments
  medicalDate: { type: Date },
  embassyDate: { type: Date },

  // Travel Details
  travel: {
    departureDate: Date,
    flightNumber: String,
    departureTime: String,
    arrivalTime: String,
    needsPickup: { type: Boolean, default: false },
    accommodationAddress: String
  },

  // Packing List Checkbox Status
  packingList: [
    { name: String, checked: { type: Boolean, default: false } }
  ]
});

export default mongoose.models.VisaProcess || mongoose.model("VisaProcess", VisaProcessSchema);