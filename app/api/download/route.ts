// app/api/download/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// আপনার FFmpeg পাথ (অবশ্যই সঠিক হতে হবে, না হলে অডিও আসবে না)
const FFMPEG_PATH = "C:\\ffmpeg\\bin\\ffmpeg.exe";

export async function POST(req: Request) {
  try {
    const { url, format, quality } = await req.json();

    if (!url) {
      return NextResponse.json(
        { status: "error", text: "Invalid URL" },
        { status: 400 }
      );
    }

    const downloadDir = path.join(process.cwd(), 'public', 'downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const fileName = `CD_File_${Date.now()}`;
    const outputPath = path.join(downloadDir, `${fileName}.%(ext)s`);
    const ytDlpPath = `C:\\tools\\yt-dlp.exe`;

    let command = "";

    if (format === "audio") {
      command = `"${ytDlpPath}" -x --audio-format mp3 --audio-quality 0 --ffmpeg-location "${FFMPEG_PATH}" -o "${outputPath}" "${url}"`;
    } else {
      // ✅ FIX: -f অপশন আপডেট করা হয়েছে যাতে ব্রাউজার সাপোর্টেড mp4 তৈরি হয়
      // এটি প্রথমে সেরা ভিডিও (1080p বা 720p) এবং সেরা অডিও (m4a) খুঁজবে, তারপর তাদের মার্জ করবে
      const videoFilter = quality === '1080p' ? 'bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/best[ext=mp4]/best' : 'bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best[ext=mp4]/best';

      command = `"${ytDlpPath}" -f "${videoFilter}" --merge-output-format mp4 --ffmpeg-location "${FFMPEG_PATH}" -o "${outputPath}" "${url}"`;
    }

    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("yt-dlp error:", stderr);
          reject(new Error(stderr || "Download process failed"));
        } else {
          resolve(stdout);
        }
      });
    });

    const files = fs.readdirSync(downloadDir);
    const latestFile = files
      .filter(file => file.startsWith(fileName))
      .sort()
      .reverse()[0];

    if (!latestFile) {
      return NextResponse.json(
        { status: "error", text: "File was not generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      url: `/downloads/${latestFile}`
    });

  } catch (error: unknown) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { status: "error", text: (error as Error).message || "Server error occurred" },
      { status: 500 }
    );
  }
}