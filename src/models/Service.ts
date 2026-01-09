import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string; // URL-এর জন্য (যেমন: visa-support)
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
    
    // 🚀 SEO Friendly URL-এর জন্য slug ফিল্ড
    // এটি ইউনিক হতে হবে, যাতে দুইটা সার্ভিসের লিংক এক না হয়ে যায়
    slug: { type: String, required: true, unique: true }, 

    description: { type: String, required: true },
    icon: { type: String, required: true }, // Lucide Icon Name or Image URL
    
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

// 🚀 Indexing: আমরা স্লাগ দিয়ে পেজ লোড করব, তাই এটি ইনডেক্স করা জরুরি
ServiceSchema.index({ slug: 1 });

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;