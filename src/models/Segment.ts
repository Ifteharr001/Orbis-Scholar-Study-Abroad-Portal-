import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISegment extends Document {
  name: string;
  description: string;
  color: string;
  conditions: string[];
  createdAt: Date;
}

const SegmentSchema = new Schema<ISegment>(
  {
    name: { type: String, required: true },
    description: { type: String },
    color: { type: String, default: "bg-blue-500" },
    conditions: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Segment: Model<ISegment> =
  mongoose.models.Segment || mongoose.model<ISegment>("Segment", SegmentSchema);

export default Segment;