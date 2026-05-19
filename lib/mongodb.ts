import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// During Vercel build, environment variables might not be available for code that gets evaluated.
// Don't crash at import-time; fail only when a DB connection is actually requested.


// আমরা নামটিকে 'connectDB' ফিক্সড করে দিচ্ছি যাতে API Route এটি খুঁজে পায়
export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    if (!MONGODB_URI) {
      throw new Error("Missing MONGODB_URI environment variable");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("Failed to connect to database");
  }
};
