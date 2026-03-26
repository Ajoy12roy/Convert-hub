import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ status: "error", text: "Video URL is required" }, { status: 400 });
    }

    // অল্টারনেটিভ স্টেবল এপিআই কল
    const apiUrl = `https://api.socialdownloader.xyz/api/v1/download?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    const data = await response.json();

    if (data && data.data) {
      return NextResponse.json({
        status: "success",
        url: data.data.url,
        title: data.data.title || "Video Download"
      });
    }

    return NextResponse.json({ status: "error", text: "Video not found or link is private." }, { status: 400 });

  } catch (error: any) {
    console.error("API ROUTE ERROR:", error.message);
    return NextResponse.json(
      { status: "error", text: "External API is currently unreachable." }, 
      { status: 500 }
    );
  }
}