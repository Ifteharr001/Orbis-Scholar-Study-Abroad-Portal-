import mongoose, { Schema, Document, Model } from "mongoose";

// ১. TypeScript Interface আপডেট
export interface INews extends Document {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date; // timestamps: true এর কারণে এটি অটোমেটিক আসবে
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true }, // ছোট ডেসক্রিপশন (কার্ডে দেখানোর জন্য)
    content: { type: String, required: true }, // ফুল ডিটেইলস (HTML বা Markdown)
    image: { type: String, required: true },
    
    // ক্যাটাগরি ফিক্সড রাখা ভালো (Dropdown এর জন্য সুবিধা হবে)
    category: { type: String, required: true }, 
  },
  { timestamps: true }
);

// 🚀 ২. পারফর্ম্যান্স অপটিমাইজেশন (Indexing)

// "Latest News" দেখানোর জন্য (সবচেয়ে নতুন খবর আগে আসবে)
NewsSchema.index({ createdAt: -1 });

// ক্যাটাগরি ফিল্টার করার জন্য (যেমন: শুধু 'Visa Update' বা 'Scholarship' খবর খোঁজা)
NewsSchema.index({ category: 1 });

// ৩. মডেল এক্সপোর্ট
const News: Model<INews> = mongoose.models.News || mongoose.model<INews>("News", NewsSchema);

export default News;