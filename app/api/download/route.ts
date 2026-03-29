import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url, platform } = await req.json();

    if (!url) {
      return NextResponse.json(
        { status: "error", text: "Please provide a valid URL" }, 
        { status: 400 }
      );
    }

    // Try multiple download services
    let downloadLink = await trySavevid(url, platform);
    
    if (!downloadLink) {
      downloadLink = await tryYtDlp(url);
    }
    
    if (!downloadLink) {
      downloadLink = await tryMuxedApi(url);
    }

    if (downloadLink) {
      return NextResponse.json({ status: "success", url: downloadLink });
    }

    return NextResponse.json(
      { 
        status: "error", 
        text: "Could not find video link. Make sure the video is public and try again." 
      },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Download Error:", error.message);
    return NextResponse.json(
      { 
        status: "error", 
        text: "Server error. Please try again with a valid video URL." 
      },
      { status: 500 }
    );
  }
}

// Service 1: Savevid.net
async function trySavevid(url: string, platform: string) {
  try {
    const response = await axios.post(
      "https://savevid.net/api/ajaxSearch",
      new URLSearchParams({
        q: url,
        vt: platform || "home"
      }).toString(),
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept": "*/*",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      }
    );

    const data = response.data;
    if (data && data.status === "ok" && data.data) {
      const $ = cheerio.load(data.data);
      
      // Updated selectors for current Savevid format
      const downloadLink = 
        $('a.btn-download').first().attr('href') || 
        $('a[href*="dl.savevid"]').first().attr('href') ||
        $('a[data-download]').first().attr('href') ||
        $('a').filter((_, el) => $(el).text().includes('Download')).first().attr('href');

      if (downloadLink && (downloadLink.startsWith('http') || downloadLink.startsWith('/'))) {
        return downloadLink;
      }
    }
  } catch (error) {
    console.warn("Savevid service failed:", error);
  }
  return null;
}

// Service 2: YT-DLP based service (more reliable)
async function tryYtDlp(url: string) {
  try {
    const response = await axios.post(
      "https://api.cobalt.tools/api/json",
      { url },
      {
        timeout: 10000,
        headers: { "Accept": "application/json" }
      }
    );

    if (response.data?.url) {
      return response.data.url;
    }
  } catch (error) {
    console.warn("YT-DLP service failed:", error);
  }
  return null;
}

// Service 3: Muxed API (YouTube, Instagram, TikTok)
async function tryMuxedApi(url: string) {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await axios.get(
      `https://api.muxed.top/video?url=${encodedUrl}`,
      {
        timeout: 10000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      }
    );

    if (response.data?.url) {
      return response.data.url;
    }
  } catch (error) {
    console.warn("Muxed API service failed:", error);
  }
  return null;
}