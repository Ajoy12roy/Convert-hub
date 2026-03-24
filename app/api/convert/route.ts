import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = process.env.CONVERT_API_SECRET;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('format') as string;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString('base64');

    const sourceFormat = file.name.split('.').pop()?.toLowerCase() || 'docx';
    // StoreFile: true যোগ করা হয়েছে যাতে তারা ডাউনলোড লিঙ্ক পাঠায়
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

    if (!response.ok) {
      return NextResponse.json({ error: result.Message || 'API Error' }, { status: response.status });
    }

    // আপনার পাঠানো JSON অনুযায়ী এখানে Files (Capital F) চেক করা হচ্ছে
    const files = result.Files || result.files;
    
    if (files && files[0]) {
      // যদি Url থাকে তবে সেটা নেবে, না থাকলে FileData নেবে (Base64 ডাউনলোড সাপোর্ট করার জন্য)
      const downloadUrl = files[0].Url || files[0].url;
      const fileData = files[0].FileData || files[0].fileData;

      if (downloadUrl) {
        return NextResponse.json({ url: downloadUrl });
      } else if (fileData) {
        // যদি এপিআই ডাটা পাঠায়, তবে আমরা একটি ডাটা ইউআরএল তৈরি করে পাঠাবো
        const mimeType = `application/${targetFormat}`;
        return NextResponse.json({ url: `data:${mimeType};base64,${fileData}` });
      }
    }

    throw new Error("No download URL or FileData found in API response");

  } catch (error: any) {
    console.error("Conversion Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}