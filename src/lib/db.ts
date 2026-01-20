import mongoose from "mongoose";

// পরিবেশ ভেরিয়েবল চেক (URI বা URL যেটাই থাকুক কাজ করবে)
const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;

if (!MONGODB_URL) {
  throw new Error("❌ Please define MONGODB_URL or MONGODB_URI in your .env file");
}

// TypeScript এর জন্য গ্লোবাল ক্যাশ ইন্টারফেস
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

// গ্লোবাল ভেরিয়েবল থেকে ক্যাশ নেওয়া (যাতে হট রিলোডে কানেকশন না হারায়)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connect = async () => {
  // ১. যদি আগের কানেকশন থাকে, সেটাই ব্যবহার করবে (এটাই স্পিড বাড়াবে)
  if (cached.conn) {
    return cached.conn;
  }

  // ২. কানেকশন না থাকলে নতুন কানেকশন তৈরি করবে
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // ৫০০০ এর বদলে ৩০,০০০ (৩০ সেকেন্ড) দিন
      socketTimeoutMS: 45000,
    };
    cached.promise = mongoose.connect(MONGODB_URL!, opts).then((mongoose) => {
      console.log("✅ New MongoDB connection established");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
};