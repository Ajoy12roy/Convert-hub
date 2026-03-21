import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// বড় ফাইল হ্যান্ডেল করার জন্য কনফিগারেশন
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: "No image file found" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ২০২৬ সালের নতুন নিয়ম অনুযায়ী Transformation ব্যবহার করা হয়েছে
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          // এখানে background_removal অ্যাড-অন এর বদলে effect ব্যবহার করা হয়েছে
          transformation: [
            { effect: "background_removal" }, 
            { format: "png" }
          ],
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    const cloudinaryResult = result as any;
    
    // যদি ব্যাকগ্রাউন্ড রিমুভ না হয় তবে ক্লাউডিনারি অরিজিনাল ইউআরএল দেয়
    return NextResponse.json({ url: cloudinaryResult.secure_url });

  } catch (error: any) {
    console.error("Server Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process background removal" }, 
      { status: 500 }
    );
  }
}