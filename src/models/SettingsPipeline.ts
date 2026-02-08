import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettingsPipeline extends Document {
  name: string;  
  color: string;
  order: number;  
}

const SettingsPipelineSchema = new Schema<ISettingsPipeline>(
  {
    name: { type: String, required: true },
    color: { type: String, default: "#000000" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SettingsPipeline: Model<ISettingsPipeline> = mongoose.models.SettingsPipeline || mongoose.model<ISettingsPipeline>("SettingsPipeline", SettingsPipelineSchema);

export default SettingsPipeline;