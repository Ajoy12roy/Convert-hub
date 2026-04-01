// app/video-downloader/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Youtube, 
  Facebook, 
  Instagram, 
  Download, 
  Loader2, 
  Globe, 
  Music2,
  PlayCircle,
  Headphones,
  Save,
  RefreshCcw
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';


const TypewriterText = ({ text, speed = 100 }: { text: string; speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    setDisplayText('');
    const timer = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [text, speed]);

  return (
    <span className="relative">
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} inline-block w-0.75 h-[0.9em] bg-slate-900 ml-1 align-middle transition-opacity duration-100`} />
    </span>
  );
};

const platforms = [
  { name: 'YouTube', icon: <Youtube size={24} />, color: 'bg-red-500', light: 'bg-red-50', border: 'border-red-400', text: 'text-red-700' },
  { name: 'Facebook', icon: <Facebook size={24} />, color: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700' },
  { name: 'Instagram', icon: <Instagram size={24} />, color: 'bg-pink-600', light: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-700' },
  { name: 'TikTok', icon: <Music2 size={24} />, color: 'bg-lime-600', light: 'bg-lime-100', border: 'border-lime-400', text: 'text-lime-900' },
  { name: 'Google Drive', icon: <Globe size={24} />, color: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700' },
];

export default function VideoDownloaderPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube');
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [quality, setQuality] = useState("720p"); 
  const [format, setFormat] = useState("video"); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [finalDownloadUrl, setFinalDownloadUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const activePlatform = platforms.find(p => p.name === selectedPlatform) || platforms[0];

  useEffect(() => {
    if (videoUrl.includes("http")) {
      setPreviewUrl(videoUrl);
      setFinalDownloadUrl(null); 
    } else {
      setPreviewUrl(null);
    }
  }, [videoUrl]);

  const executeDownload = async (url: string, fileExtension: string) => {
    try {
      setDownloadProgress(1);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const mimeType = format === 'audio' ? 'audio/mpeg' : 'video/mp4';
      const finalBlob = new Blob([blob], { type: mimeType });
      
      const downloadUrl = window.URL.createObjectURL(finalBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `CD_File_${Date.now()}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      setDownloadProgress(100);
      toast.success("Download Complete!");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Download failed.");
      setDownloadProgress(0);
    }
  };

  const handleConvert = async () => {
    if (!videoUrl.trim()) return toast.error("Please paste a link!");
    
    setIsDownloading(true);
    setDownloadProgress(0);
    setFinalDownloadUrl(null);
    const loadingToast = toast.loading(`Processing ${format}...`);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: videoUrl,
          platform: selectedPlatform.toLowerCase(),
          quality,   
          format     
        }),
      });

      const result = await response.json();

      if (response.ok && result.url) {
        toast.success("✓ Conversion successful!", { id: loadingToast });
        setFinalDownloadUrl(result.url); 
      } else {
        throw new Error(result.text || "Failed to fetch file.");
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || "Error occurred", { id: loadingToast });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 flex flex-col items-center font-sans animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4 animate-bounce duration-2000">
             <div className="bg-purple-100 p-4 rounded-3xl text-purple-600 shadow-sm">
               <Video size={40} />
             </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
            <TypewriterText text="Video Downloader" />
          </h1>
        </div>

        <div className="bg-white border border-white/40 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.06)] relative overflow-hidden animate-in slide-in-from-bottom-8 duration-1000">
          
          <div className="mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => { setSelectedPlatform(platform.name); setFinalDownloadUrl(null); }}
                  className={`flex flex-col items-center p-5 rounded-3xl border-2 transition-all duration-300 ${selectedPlatform === platform.name ? `${platform.border} ${platform.light} scale-105 shadow-md` : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                >
                  <div className={`mb-2 transition-transform duration-300 ${selectedPlatform === platform.name ? `${platform.text} scale-110` : 'text-slate-400'}`}>{platform.icon}</div>
                  <span className="text-[10px] font-bold uppercase">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 group">
            <input 
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste URL here..."
              className="w-full px-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-purple-400 focus:bg-white text-slate-700 font-medium transition-all duration-300"
            />

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 bg-slate-50 p-4 rounded-2xl transition-all shadow-inner">
                <button 
                  onClick={() => { setQuality('1080p'); setFormat('video'); setFinalDownloadUrl(null); }} 
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${quality === '1080p' && format === 'video' ? 'bg-orange-800 text-white shadow-lg scale-105' : 'bg-white border hover:border-slate-300 hover:bg-orange-400'}`}
                >1080p (Full HD)</button>
                <button 
                  onClick={() => { setQuality('720p'); setFormat('video'); setFinalDownloadUrl(null); }} 
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${quality === '720p' && format === 'video' ? 'bg-purple-800 text-white shadow-lg scale-105' : 'bg-white border hover:border-slate-300 hover:bg-purple-400'}`}
                >720p (HD)</button>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <button 
                  onClick={() => { setFormat('audio'); setQuality('best'); setFinalDownloadUrl(null); }} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${format === 'audio' ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'bg-white border hover:border-emerald-200 hover:bg-emerald-200'}`}
                >
                  <Music2 size={16} /> MP3 Audio
                </button>
            </div>
          </div>

         {previewUrl && (
             <div 
               className="mb-8 w-full max-w-lg mx-auto bg-slate-900 rounded-3xl overflow-hidden aspect-video relative flex items-center justify-center border-4 border-purple-400 transition-all duration-500 hover:scale-[1.02]"
               style={{ boxShadow: '0 20px 50px -12px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(0,0,0,0.5)' }}
             >
                {finalDownloadUrl ? (
                    format === 'audio' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 p-8 text-white">
                            <Headphones size={48} className="mb-4 text-emerald-400 animate-pulse" />
                            <audio ref={audioRef} controls src={finalDownloadUrl} className="w-full" autoPlay />
                        </div>
                    ) : (
                        <video ref={videoRef} controls src={finalDownloadUrl} className="w-full h-full object-contain" autoPlay />
                    )
                ) : (
                    <div className="text-center text-white/30">
                        <PlayCircle size={60} className="mx-auto mb-2 animate-pulse" />
                        <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Awaiting File</p>
                    </div>
                )}
             </div>
          )}

          <div className="flex justify-center flex-wrap gap-4">
            {!finalDownloadUrl ? (
                <button 
                  onClick={handleConvert}
                  disabled={isDownloading || !videoUrl}
                  className={`flex items-center gap-4 px-12 py-6 rounded-3xl font-black text-2xl text-white shadow-2xl transition-all active:scale-95 disabled:opacity-90 ${activePlatform.color} hover:brightness-110`}
                >
                  {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
                  {isDownloading ? "Converting..." : "Convert Now"}
                </button>
            ) : (
                <>
                 <button 
                   onClick={handleConvert}
                   disabled={isDownloading}
                   className={`flex items-center gap-3 px-8 py-6 rounded-3xl font-bold text-lg text-white shadow-lg transition-all active:scale-95 ${activePlatform.color} opacity-90 hover:opacity-100`}
                 >
                   {isDownloading ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
                   Re-Convert
                 </button>

                 <button 
                   onClick={() => executeDownload(finalDownloadUrl, format === 'audio' ? 'mp3' : 'mp4')}
                   className="flex items-center gap-4 px-12 py-6 rounded-3xl font-black text-2xl text-white shadow-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 animate-in zoom-in-90 duration-500"
                 >
                   <Save /> {format === 'audio' ? 'Save MP3' : 'Save Video'}
                 </button>
                </>
            )}
          </div>

          {downloadProgress > 0 && downloadProgress < 100 && (
            <div className="mt-6 w-full max-w-xs mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-300" style={{width: `${downloadProgress}%`}}></div>
            </div>
          )}

          <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-3xl ${activePlatform.color}`} />
        </div>
      </div>
    </div>
  );
}