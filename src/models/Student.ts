import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  counselor?: mongoose.Types.ObjectId; 
  createdAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    notes: { type: String },
    
    counselor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;