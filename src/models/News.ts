import mongoose, { Schema, Document, models, model } from "mongoose";

export interface INews extends Document {
  title: string;
  excerpt: string;
  content: string; // ফুল ডিটেইলস এর জন্য
  image: string;
  category: string;
  createdAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true }, 
    content: { type: String, required: true }, 
    image: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const News = models.News || model<INews>("News", NewsSchema);
export default News;