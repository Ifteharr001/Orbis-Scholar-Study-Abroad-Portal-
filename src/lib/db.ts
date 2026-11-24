import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function getMongoUrl(): string {
  const url = process.env.MONGODB_URL || process.env.MONGODB_URI;
  if (!url) {
    throw new Error("❌ Please define MONGODB_URL or MONGODB_URI in your .env file");
  }
  return url;
}

// Detect if we're in a build context (static generation)
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build" ||
                    process.env.NODE_ENV === "production" && !process.env.MONGODB_URL;

export const connect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const url = getMongoUrl();

    // During build, fail fast with shorter timeout if MongoDB unreachable
    const isBuild = process.env.NEXT_PHASE === "phase-production-build";
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: isBuild ? 5000 : 30000, // 5s during build, 30s runtime
      socketTimeoutMS: isBuild ? 5000 : 45000,
    };

    cached.promise = mongoose.connect(url, opts)
      .then((mongoose) => {
        console.log("New MongoDB connection established");
        return mongoose;
      })
      .catch((err) => {
        cached.promise = null;
        if (isBuild) {
          console.error("❌ Build-time MongoDB connection failed. Ensure MONGODB_URL is set and network allows MongoDB Atlas access.");
          throw new Error(`MongoDB connection failed during build: ${err.message}`);
        }
        throw err;
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