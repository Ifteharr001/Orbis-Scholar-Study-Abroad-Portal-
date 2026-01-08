import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  icon: string;
  gallery: string[]; 
  sections: {
    heading: string;
    body: string;
  }[]; 
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
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

const Service = models.Service || model<IService>("Service", ServiceSchema);
export default Service;