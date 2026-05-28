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
import { useAuthStore } from '@/store/useAuthStore';

// টাইপরাইটার অ্যানিমেশন (Updated for Dark Mode)
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
      {/* ডার্ক মোডে কার্সার সাদা হবে */}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} inline-block w-0.75 h-[0.9em] bg-slate-900 dark:bg-white ml-1 align-middle transition-opacity duration-100`} />
    </span>
  );
};

const platforms = [
  { name: 'YouTube', icon: <Youtube size={24} />, color: 'bg-red-500', light: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-400', text: 'text-red-700 dark:text-red-400' },
  { name: 'Facebook', icon: <Facebook size={24} />, color: 'bg-blue-600', light: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-400', text: 'text-blue-700 dark:text-blue-400' },
  { name: 'Instagram', icon: <Instagram size={24} />, color: 'bg-pink-600', light: 'bg-pink-100 dark:bg-pink-950/30', border: 'border-pink-400', text: 'text-pink-700 dark:text-pink-400' },
  { name: 'TikTok', icon: <Music2 size={24} />, color: 'bg-lime-600', light: 'bg-lime-100 dark:bg-lime-950/30', border: 'border-lime-400', text: 'text-lime-900 dark:text-lime-400' },
  { name: 'Google Drive', icon: <Globe size={24} />, color: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-400', text: 'text-amber-700 dark:text-amber-400' },
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
  const { addToHistory } = useAuthStore() as any;
  
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

  // === Updated Error-Free showSaveFilePicker Native Download Logic ===
  const executeDownload = async (url: string, fileExtension: string) => {
    try {
      setDownloadProgress(1);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const mimeType = format === 'audio' ? 'audio/mpeg' : 'video/mp4';
      const finalBlob = new Blob([blob], { type: mimeType });
      const suggestedName = `CD_File_${Date.now()}.${fileExtension}`;
      
      const win = window as any;

      // Fallback for browsers that do not support showSaveFilePicker (Firefox, Safari, Mobile devices)
      if (!win.showSaveFilePicker) {
        const downloadUrl = window.URL.createObjectURL(finalBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = suggestedName;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        setDownloadProgress(100);
        toast.success("Download Complete!");
        return;
      }

      // Modern desktop browsers with native File System Access API support
      const acceptTypes = format === 'audio' ? { 'audio/mpeg': ['.mp3'] } : { 'video/mp4': ['.mp4'] };
      const description = format === 'audio' ? 'Audio File' : 'Video File';

      const handle = await win.showSaveFilePicker({
        suggestedName: suggestedName,
        types: [{ description, accept: acceptTypes }],
      });
      
      const writable = await handle.createWritable();
      await writable.write(finalBlob);
      await writable.close();
      
      setDownloadProgress(100);
      toast.success("File saved successfully!");
    } catch (err: any) {
      console.error(err);
      if (err.name !== 'AbortError') {
        toast.error("Download failed.");
      }
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
        if (addToHistory) addToHistory("Video Downloader", `${selectedPlatform} ${format === 'audio' ? 'MP3' : quality}`); 
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 p-4 md:p-10 flex flex-col items-center font-sans animate-in fade-in duration-700 transition-colors">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4 animate-bounce duration-2000">
             <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-3xl text-purple-600 dark:text-purple-400 shadow-sm">
               <Video size={40} />
             </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">
            <TypewriterText text="Video Downloader" />
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-white/40 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.06)] dark:shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-1000">
          
          <div className="mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => { setSelectedPlatform(platform.name); setFinalDownloadUrl(null); }}
                  className={`flex flex-col items-center p-5 rounded-3xl border-2 transition-all duration-300 ${
                    selectedPlatform === platform.name 
                    ? `${platform.border} ${platform.light} scale-105 shadow-md` 
                    : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`mb-2 transition-transform duration-300 ${selectedPlatform === platform.name ? `${platform.text} scale-110` : 'text-slate-400'}`}>{platform.icon}</div>
                  <span className="text-[10px] font-bold uppercase dark:text-slate-400">{platform.name}</span>
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
              className="w-full px-6 py-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-purple-400 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-all duration-300"
            />

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl transition-all shadow-inner border border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => { setQuality('1080p'); setFormat('video'); setFinalDownloadUrl(null); }} 
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    quality === '1080p' && format === 'video' 
                    ? 'bg-orange-800 text-white shadow-lg scale-105' 
                    : 'bg-white dark:bg-slate-700 border dark:border-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:bg-orange-400'
                  }`}
                >1080p (Full HD)</button>
                <button 
                  onClick={() => { setQuality('720p'); setFormat('video'); setFinalDownloadUrl(null); }} 
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    quality === '720p' && format === 'video' 
                    ? 'bg-purple-800 text-white shadow-lg scale-105' 
                    : 'bg-white dark:bg-slate-700 border dark:border-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:bg-purple-400'
                  }`}
                >720p (HD)</button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                <button 
                  onClick={() => { setFormat('audio'); setQuality('best'); setFinalDownloadUrl(null); }} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    format === 'audio' 
                    ? 'bg-emerald-500 text-white shadow-lg scale-105' 
                    : 'bg-white dark:bg-slate-700 border dark:border-slate-600 dark:text-slate-300 hover:border-emerald-200 hover:bg-emerald-200'
                  }`}
                >
                  <Music2 size={16} /> MP3 Audio
                </button>
            </div>
          </div>

         {previewUrl && (
             <div 
               className="mb-8 w-full max-w-lg mx-auto bg-slate-900 dark:bg-black rounded-3xl overflow-hidden aspect-video relative flex items-center justify-center border-4 border-purple-400 transition-all duration-500 hover:scale-[1.02]"
               style={{ boxShadow: '0 20px 50px -12px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(0,0,0,0.5)' }}
             >
                {finalDownloadUrl ? (
                    format === 'audio' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 dark:bg-slate-900 p-8 text-white">
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
            <div className="mt-6 w-full max-w-xs mx-auto bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-300" style={{width: `${downloadProgress}%`}}></div>
            </div>
          )}

          <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-3xl ${activePlatform.color}`} />
        </div>
      </div>
    </div>
  );
}