import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

type CloudinaryResult = {
  secure_url?: string;
};


// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string };
    const url = body?.url;

    if (!url) {
      return NextResponse.json({ error: "No image url provided" }, { status: 400 });
    }

    // Fetch image bytes from URL (so frontend can upload to Cloudinary first)
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return NextResponse.json({ error: "Failed to fetch image from url" }, { status: 400 });
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<CloudinaryResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          transformation: [
            { effect: "background_removal" },
            { format: "png" },
          ],
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(error);
            return;
          }

          resolve({
            secure_url: (result as CloudinaryResult | null | undefined)?.secure_url,
          });
        }
      );
      uploadStream.end(buffer);
    });

    if (!result?.secure_url) {
      return NextResponse.json(
        { error: "Cloudinary did not return secure_url" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    console.error("Server Route Error:", error);

    return NextResponse.json(
      { error: message || "Failed to process background removal" },
      { status: 500 }
    );
  }
}

