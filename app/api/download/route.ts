import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ status: "error" });
    }

    // 👉 IMPORTANT: path ঠিক দাও
    const command = `C:\\tools\\yt-dlp.exe -f best -g "${url}"`;

    const videoUrl: string = await new Promise((resolve, reject) => {
      exec(command, (error, stdout) => {
        if (error) reject("failed");
        else resolve(stdout.trim());
      });
    });

    return NextResponse.json({
      status: "success",
      url: videoUrl
    });

  } catch {
    return NextResponse.json({ status: "error" });
  }
}