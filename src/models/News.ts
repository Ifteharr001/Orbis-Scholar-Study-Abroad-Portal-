import mongoose, { Schema, Document, Model } from "mongoose";

export interface INews extends Document {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date; 
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
NewsSchema.index({ createdAt: -1 });

NewsSchema.index({ category: 1 });

const News: Model<INews> = mongoose.models.News || mongoose.model<INews>("News", NewsSchema);

export default News;