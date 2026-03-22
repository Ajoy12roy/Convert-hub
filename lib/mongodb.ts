import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectMongoDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env.local");
    }

    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGODB_URI);
    console.log(">>> MongoDB Connected Successfully ✅");
  } catch (error) {
    console.error(">>> MongoDB Connection Error ❌:", error);
    // সার্ভার এরর দেখার জন্য এটি থ্রো করা জরুরি
    throw error;
  }
};