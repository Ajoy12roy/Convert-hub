import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url, platform } = await req.json();

    if (!url) {
      return NextResponse.json({ status: "error", text: "Please provide a valid URL" }, { status: 400 });
    }

    // Savevid.net এর AJAX এন্ডপয়েন্ট
    const SAVEVID_API = "https://savevid.net/api/ajaxSearch";

    const response = await axios.post(
      SAVEVID_API,
      new URLSearchParams({
        q: url,
        vt: platform || "home"
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept": "*/*",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      }
    );

    const data = response.data;

    // Savevid সাধারণত ডাটা হিসেবে HTML রিটার্ন করে যা পার্স করতে হয়
    if (data && data.status === "ok" && data.data) {
      const $ = cheerio.load(data.data);
      
      // ডাউনলোড বাটনের লিঙ্ক খুঁজে বের করা
      const downloadLink = $('a.btn-download').first().attr('href') || 
                           $('a[href*="dl.savevid"]').first().attr('href');

      if (downloadLink) {
        return NextResponse.json({ status: "success", url: downloadLink });
      }
    }

    return NextResponse.json({ 
      status: "error", 
      text: "Could not find video link. Make sure the video is public." 
    }, { status: 400 });

  } catch (error: any) {
    console.error("Scraping Error:", error.message);
    return NextResponse.json({ 
      status: "error", 
      text: "Server error or video not found." 
    }, { status: 500 });
  }
}