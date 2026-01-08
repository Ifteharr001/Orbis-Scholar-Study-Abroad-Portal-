import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("❌ MONGODB_URL is not defined in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connect = async () => {
  // ১. যদি আগের কানেকশন থাকে, সেটাই ব্যবহার করবে (এটিই স্পিড বাড়াবে)
  if (cached.conn) {
    // console.log("🚀 Using cached MongoDB connection"); // ডিবাগিং এর জন্য চাইলে কমেন্ট আউট করতে পারেন
    return cached.conn;
  }

  // ২. কানেকশন না থাকলে নতুন কানেকশন তৈরি করবে
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // একসাথে ১০টির বেশি কানেকশন খুলবে না (সার্ভার স্লো হওয়া আটকাবে)
      serverSelectionTimeoutMS: 5000, // ৫ সেকেন্ডের মধ্যে কানেক্ট না হলে এরর দিবে (অযথা লোডিং হয়ে থাকবে না)
      socketTimeoutMS: 45000, // সকেট টাইমআউট
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
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