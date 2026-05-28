import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // ফ্রন্টএন্ড থেকে আসা ফর্ম ডেটা রিসিভ করা
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // ফাইলটিকে বাফার (Buffer) এ কনভার্ট করা
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ক্লাউডিনারিতে আপলোড এবং ব্যাকগ্রাউন্ড রিমুভাল
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          transformation: [
            { effect: "background_removal" } // ব্যাকগ্রাউন্ড রিমুভ করার কমান্ড
          ],
          format: "png", // আউটপুট ফরম্যাট
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(error);
            return;
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    if (!result?.secure_url) {
      return NextResponse.json(
        { error: "Cloudinary did not return a secure URL" },
        { status: 500 }
      );
    }

    // সফল হলে ফ্রন্টএন্ডে URL পাঠিয়ে দেওয়া
    return NextResponse.json({ url: result.secure_url });
    
  } catch (error: any) {
    console.error("Server Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process background removal" },
      { status: 500 }
    );
  }
}