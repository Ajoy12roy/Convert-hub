"use client";

import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Youtube, 
  Facebook, 
  Instagram, 
  Download, 
  Link as LinkIcon, 
  Loader2, 
  CheckCircle2, 
  Globe, 
  Music2,
  RefreshCcw
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Typewriter Component
const TypewriterText = ({ text, delay = 0, speed = 50 }: { text: string, delay?: number, speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayText}</span>;
};

const platforms = [
  { name: 'YouTube', icon: <Youtube size={24} />, color: 'bg-red-500', light: 'bg-red-50', border: 'border-red-400', text: 'text-red-700' },
  { name: 'Facebook', icon: <Facebook size={24} />, color: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700' },
  { name: 'Instagram', icon: <Instagram size={24} />, color: 'bg-pink-600', light: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-700' },
  { name: 'TikTok', icon: <Music2 size={24} />, color: 'bg-slate-900', light: 'bg-slate-100', border: 'border-slate-400', text: 'text-slate-900' },
  { name: 'Google Drive', icon: <Globe size={24} />, color: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700' },
];

export default function VideoDownloaderPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('YouTube');
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const activePlatform = platforms.find(p => p.name === selectedPlatform) || platforms[0];

  const handleDownload = async () => {
    if (!videoUrl.trim()) return toast.error("Please paste a video link!");
    
    setIsDownloading(true);
    const loadingToast = toast.loading(`Fetching video from ${selectedPlatform}...`);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            url: videoUrl,
            platform: selectedPlatform.toLowerCase() // প্ল্যাটফর্ম ব্যাকএন্ডে পাঠানো হচ্ছে
        }),
      });

      const result = await response.json();

      if (result.status === "success" && result.url) {
        window.open(result.url, "_blank");
        toast.success("Download link generated successfully!", { id: loadingToast });
      } else {
        // ব্যাকএন্ড থেকে আসা নির্দিষ্ট এরর মেসেজ দেখানো
        throw new Error(result.text || "Failed to fetch video. Check link privacy.");
      }

    } catch (error: any) {
      console.error("Frontend Error:", error);
      toast.error(error.message || "Connection failed. Please try again.", { id: loadingToast });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 flex flex-col items-center font-sans">
      <Toaster position="top-right" />
      
      <div className={`w-full max-w-4xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        <div className="text-center mb-12 mt-8">
          <div className="flex justify-center mb-4">
             <div className="bg-purple-100 p-4 rounded-3xl text-purple-600 shadow-sm transition-transform hover:scale-110 duration-300">
               <Video size={40} />
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic uppercase">
            <TypewriterText text="Video Downloader" speed={100} />
          </h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">
            Download videos directly from your favorite social platforms.
          </p>
        </div>

        <div className="bg-white border border-white/40 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.06)] relative overflow-hidden">
          
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 justify-center">
              <span className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-full text-sm">1</span>
              Choose Platform
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => {
                    setSelectedPlatform(platform.name);
                    setVideoUrl('');
                  }}
                  className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all duration-300 group ${
                    selectedPlatform === platform.name 
                    ? `${platform.border} ${platform.light} scale-105 shadow-lg` 
                    : 'border-transparent bg-slate-50 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`mb-3 transition-transform group-hover:scale-110 ${selectedPlatform === platform.name ? platform.text : 'text-slate-400'}`}>
                    {platform.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${selectedPlatform === platform.name ? platform.text : 'text-slate-500'}`}>
                    {platform.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 justify-center">
              <span className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-full text-sm">2</span>
              Paste Video Link
            </h2>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                <LinkIcon size={22} />
              </div>
              <input 
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={`Paste your ${selectedPlatform} link here...`}
                className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-purple-400 focus:bg-white transition-all text-slate-700 font-medium shadow-inner"
              />
              {videoUrl && (
                <button 
                  onClick={() => setVideoUrl('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <RefreshCcw size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleDownload}
              disabled={isDownloading || !videoUrl}
              className={`group relative flex items-center gap-4 px-12 py-6 rounded-3xl font-black text-2xl text-white shadow-2xl transition-all duration-500 overflow-hidden active:scale-95 disabled:opacity-70 ${activePlatform.color}`}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-4">
                {isDownloading ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : (
                  <Download className={videoUrl ? "animate-bounce" : ""} size={28} />
                )}
                {isDownloading ? "Processing..." : "Download Video"}
              </span>
            </button>
          </div>

          <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-5 blur-3xl ${activePlatform.color}`} />
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8">
           <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
              <CheckCircle2 size={16} className="text-emerald-500" /> 720p/1080p Support
           </div>
           <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
              <CheckCircle2 size={16} className="text-emerald-500" /> No Watermark
           </div>
           <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
              <CheckCircle2 size={16} className="text-emerald-500" /> Fast Response
           </div>
        </div>
      </div>
    </div>
  );
}