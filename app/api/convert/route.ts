import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = process.env.CONVERT_API_SECRET;

  // ১. সুরক্ষামূলক চেক: এপিআই কী ডিক্লেয়ার করা না থাকলে ফ্রন্টএন্ডে স্পষ্ট মেসেজ পাঠানো
  if (!secret) {
    return NextResponse.json(
      { error: 'CONVERT_API_SECRET is missing in your .env.local file. Please check your environment variables.' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('format') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString('base64');

    const sourceFormat = file.name.split('.').pop()?.toLowerCase() || 'docx';
    
    // StoreFile=true ব্যবহার করা হয়েছে যাতে ConvertAPI সরাসরি ডাউনলোড ইউআরএল জেনারেট করে
    const apiUrl = `https://v2.convertapi.com/convert/${sourceFormat}/to/${targetFormat}?Secret=${secret}&StoreFile=true`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Parameters: [
          {
            Name: 'File',
            FileValue: { Name: file.name, Data: base64File }
          }
        ]
      })
    });

    const result = await response.json();

    // ২. ConvertAPI যদি কোনো এরর রেসপন্স পাঠায় (যেমন: Unauthorized বা Credit Limit Exceeded)
    if (!response.ok) {
      return NextResponse.json(
        { error: result.Message || 'ConvertAPI conversion failed. Please verify your credentials or limits.' },
        { status: response.status }
      );
    }

    // রেসপন্স অবজেক্ট থেকে Files অ্যারে রিড করা
    const files = result.Files || result.files;
    
    if (files && files[0]) {
      const downloadUrl = files[0].Url || files[0].url;
      const fileData = files[0].FileData || files[0].fileData;

      if (downloadUrl) {
        return NextResponse.json({ url: downloadUrl });
      } else if (fileData) {
        // যদি সরাসরি ফাইল ডেটা বেস৬৪ ফরম্যাটে আসে, তবে ডেটা ইউআরএল তৈরি করে পাঠানো
        const mimeType = `application/${targetFormat.toLowerCase()}`;
        return NextResponse.json({ url: `data:${mimeType};base64,${fileData}` });
      }
    }

    throw new Error("No download URL or FileData found in API response");

  } catch (error: unknown) {
    // ✅ ESLint এবং TypeScript এরর ফিক্স করতে 'any'-এর জায়গায় 'unknown' ব্যবহার করা হয়েছে
    console.error("Conversion Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}