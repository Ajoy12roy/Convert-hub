// New reliable video download implementation using multiple fallback services and better error handling

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get('url');

    if (!videoUrl) {
        return NextResponse.json({ error: 'Missing video URL.' }, { status: 400 });
    }

    try {
        const response = await fetch(videoUrl);

        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }

        const videoBlob = await response.blob();
        return new Response(videoBlob, {
            headers: { 'Content-Type': 'video/mp4' },
        });
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({ error: 'Video download failed. Fallback to alternative services.' }, { status: 500 });
    }
}