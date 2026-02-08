import mongoose, { Schema, Document, Model } from "mongoose";


export interface IDocument extends Document {
  applicationId: string; 
  studentEmail: string;
  name: string;          
  fileName: string;      
  fileUrl: string;       
  status: "Pending" | "Verified" | "Rejected";
  category: "required" | "optional" | "rejected";
  feedback?: string;     
  uploadedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    applicationId: { type: String, required: true }, 
    studentEmail: { type: String, required: true },
    
    name: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    
    category: {
      type: String,
      enum: ["required", "optional", "rejected"],
      default: "required",
    },
    
    feedback: { type: String }, 
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


DocumentSchema.index({ applicationId: 1 });

DocumentSchema.index({ studentEmail: 1 });

DocumentSchema.index({ status: 1 });

const Documents: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);

export default Documents;