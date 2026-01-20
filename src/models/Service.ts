import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string; 
  description: string;
  icon: string;
  gallery: string[]; 
  sections: {
    heading: string;
    body: string;
  }[]; 
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    
    slug: { type: String, required: true, unique: true }, 

    description: { type: String, required: true },
    icon: { type: String, required: true }, 
    
    gallery: [{ type: String }], 
    
    sections: [
      {
        heading: { type: String },
        body: { type: String }
      }
    ]
  },
  { timestamps: true }
);

ServiceSchema.index({ slug: 1 });

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;