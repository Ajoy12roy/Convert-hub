import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    // Cloudinary-তে আপলোড এবং ব্যাকগ্রাউন্ড রিমুভ কমান্ড
    const uploadResponse = await cloudinary.uploader.upload(image, {
      background_removal: "cloudinary_ai", // এই কমান্ডটিই ম্যাজিক করবে
      format: "png",
    });

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error: any) {
    console.error("Cloudinary Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
  }
}