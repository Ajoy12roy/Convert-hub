"use client";

import React, { useState, useRef, useEffect } from 'react';
// IMPORTANT: keep ffmpeg usage client-only to avoid Vercel prerender (SSR/Static) crashes.
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { FFmpeg } from '@ffmpeg/ffmpeg'; // ✅ Safe to import type for TypeScript

import { Upload, FileVideo, Loader2, Download, RefreshCcw, Play, Scissors, Music } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

// --- Typewriter Component (Updated for Dark Mode) ---
const TypewriterText = ({ text, delay = 0, speed = 50, cursor = true }: { text: string, delay?: number, speed?: number, cursor?: boolean }) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    let timer: NodeJS.Timeout;
    const startTyping = () => {
      timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(timer);
        }
      }, speed);
    };
    const initialDelay = setTimeout(startTyping, delay);
    return () => { clearTimeout(initialDelay); clearInterval(timer); };
  }, [text, delay, speed]);

  return (
    <span>
      {displayText}
      {cursor && <span className="animate-pulse text-purple-400 font-light ml-1">|</span>}
    </span>
  );
};

export default function VideoConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('MP3');
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ffmpegError, setFfmpegError] = useState<string | null>(null);
  
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToHistory } = useAuthStore() as any; // Ignore type error for store

  const formats = [
    { name: 'MP3', color: 'bg-purple-500', hover: 'hover:bg-purple-600', shadow: 'shadow-purple-200 dark:shadow-purple-900/20' },
    { name: 'MP4', color: 'bg-blue-500', hover: 'hover:bg-blue-600', shadow: 'shadow-blue-200 dark:shadow-blue-900/20' },
    { name: 'WAV', color: 'bg-pink-500', hover: 'hover:bg-pink-600', shadow: 'shadow-pink-200 dark:shadow-pink-900/20' },
    { name: 'MKV', color: 'bg-indigo-500', hover: 'hover:bg-indigo-600', shadow: 'shadow-indigo-200 dark:shadow-indigo-900/20' },
    { name: 'AVI', color: 'bg-cyan-500', hover: 'hover:bg-cyan-600', shadow: 'shadow-cyan-200 dark:shadow-cyan-900/20' },
    { name: 'MOV', color: 'bg-rose-500', hover: 'hover:bg-rose-600', shadow: 'shadow-rose-200 dark:shadow-rose-900/20' },
    { name: 'WEBM', color:'bg-orange-500', hover: 'hover:bg-orange-600', shadow: 'shadow-orange-200 dark:shadow-orange-900/20' }
  ];

  const activeFormat = formats.find(f => f.name === targetFormat) || formats[0];

  // ✅ Fixed Race Condition: Load everything together
  const loadFfmpeg = async () => {
    setFfmpegError(null);
    setLoaded(false);
    try {
      // 1. Dynamically import FFmpeg so Vercel doesn't crash during build
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      // 2. Load Core and WASM URLs
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      setLoaded(true);
    } catch (e) {
      const msg = (e as Error)?.message || 'FFmpeg failed to load';
      console.error('FFmpeg load failed:', e);
      setLoaded(false);
      setFfmpegError(msg);
      toast.error('FFmpeg failed to load in this environment.');
    }
  };

  useEffect(() => { 
    loadFfmpeg(); 
    setMounted(true); 
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setDownloadUrl('');
    }
  };

  const startConversion = async () => {
    if (!file || !loaded) return;
    if (!ffmpegRef.current) return;

    setIsConverting(true);
    try {
      const ffmpeg = ffmpegRef.current;
      const inputName = 'input_file';
      const outputName = `output.${targetFormat.toLowerCase()}`;
      
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      
      const args = targetFormat === 'MP3' 
        ? ['-i', inputName, '-vn', '-ab', '192k', outputName]
        : ['-i', inputName, outputName];
        
      await ffmpeg.exec(args);
      const data = await ffmpeg.readFile(outputName);

      // `ffmpeg.readFile` can return a SharedArrayBuffer in some builds.
      // Convert it to a plain Uint8Array/BlobPart to satisfy TS + runtime.
      const u8 = data instanceof Uint8Array ? data : new Uint8Array(data as unknown as ArrayLike<number>);

      // Ensure we hand Blob a BlobPart that is backed by a real ArrayBuffer.
      const safeBytes = u8.buffer instanceof ArrayBuffer ? new Uint8Array(u8) : new Uint8Array(u8.slice().buffer);
      const url = URL.createObjectURL(new Blob([safeBytes]));
      
      setDownloadUrl(url);
      if (addToHistory) {
        addToHistory("Video Tool", `Convert to ${targetFormat}`);
      }
      toast.success("Conversion Complete!");
    } catch (error) {
      toast.error("Conversion failed!");
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    const defaultFileName = `C&D_converted_${file?.name.split('.')[0] || 'media'}.${targetFormat.toLowerCase()}`;
    const mimeType = ['MP3', 'WAV'].includes(targetFormat) ? 'audio' : 'video';
    const extension = `.${targetFormat.toLowerCase()}`;
    try {
      const w = window as unknown as { showSaveFilePicker?: (args: Record<string, unknown>) => Promise<unknown> };
      if (typeof w.showSaveFilePicker === 'function') {
        const handle = await w.showSaveFilePicker({
          suggestedName: defaultFileName,
          types:[{
            description: `${targetFormat} File`,
            accept: { [`${mimeType}/${targetFormat.toLowerCase()}`]: [extension] },
          }],
        }) as { createWritable: () => Promise<unknown> };

        const writable = (await handle.createWritable()) as { write: (data: Blob) => Promise<void>; close: () => Promise<void> };
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        await writable.write(blob);
        await writable.close();
        toast.success("File saved successfully!");
      } else {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = defaultFileName;
        a.click();
      }
    } catch {
      toast.error("Failed to save the file.");
    }
  };

  return (
    // ✅ ডার্ক মোড ব্যাকগ্রাউন্ড অ্যাড করা হয়েছে
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 p-4 md:p-10 flex items-center justify-center font-sans overflow-hidden transition-colors duration-300">
      <Toaster />
      
      {/* মেইন কার্ড - ডার্ক মোডে বর্ডার এবং ব্যাকগ্রাউন্ড চেঞ্জ হবে */}
      <div className={`w-full max-w-6xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-[3rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-2xl transition-all duration-1000 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* হেডিং - টেক্সট কালার আপডেট */}
        <div className="text-center mb-12 h-24">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight italic">
            <TypewriterText text="Format Conversion" speed={80} cursor={false} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
            <TypewriterText text="Fast, Secure & Local Processing" delay={1500} speed={40} />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* ভিডিও প্রিভিউ সেকশন */}
          <div className="relative group">
            <div className={`absolute -inset-1 ${activeFormat.color} rounded-[2.5rem] blur opacity-40 dark:opacity-20 transition-all duration-500`}></div>
            <div className="relative aspect-video bg-slate-900 dark:bg-black rounded-4xl overflow-hidden shadow-2xl flex items-center justify-center border border-white/20 dark:border-slate-800">
              {previewUrl ? (
                <video src={previewUrl} controls className="w-full h-full object-cover" />
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-center cursor-pointer p-10 group"
                >
                  <div className="w-20 h-20 bg-white/10 dark:bg-slate-800/50 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Play className="text-white fill-white ml-1" size={32} />
                  </div>
                  <p className="text-white/60 dark:text-slate-500 font-bold text-lg">Select Video to Preview</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="video/*" />
          </div>

          {/* কনভার্সন কন্ট্রোল */}
          <div className="space-y-8">
            <div>
              <label className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest ml-1">Select Output Format</label>
              <div className="flex flex-wrap gap-3 mt-4">
                {formats.map((fmt) => (
                  <button
                    key={fmt.name}
                    onClick={() => setTargetFormat(fmt.name)}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform ${
                      targetFormat === fmt.name 
                      ? `${fmt.color} text-white scale-110 shadow-lg ${fmt.shadow} ring-4 ring-white dark:ring-slate-800` 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {fmt.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              {!downloadUrl ? (
                <button
                  onClick={startConversion}
                  disabled={isConverting || !file || !loaded}
                  className={`group relative w-full md:w-auto overflow-hidden text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl transition-all duration-500 disabled:opacity-90 
                    ${activeFormat.color} ${activeFormat.hover} ${activeFormat.shadow}`}
                >
                  {isConverting ? <Loader2 className="animate-spin" /> : <RefreshCcw className="group-hover:rotate-180 transition-transform duration-700 ease-in-out" />}
                  {isConverting ? "Processing..." : `Convert to ${targetFormat}`}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleDownload} className="flex-1 px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600 transition-all hover:-translate-y-1">
                    <Download className="animate-bounce" /> Save As...
                  </button>
                  <button 
                    onClick={() => {setFile(null); setDownloadUrl(''); setPreviewUrl('');}}
                    className="group px-6 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <RefreshCcw className="group-hover:-rotate-180 transition-transform duration-500" />
                  </button>
                </div>
              )}
            </div>

            {!loaded && (
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 transition-opacity duration-1000">
                <Loader2 size={20} className="animate-spin" />
                {ffmpegError ? (
                  <span className="text-slate-700 dark:text-slate-200">
                    FFmpeg failed to load: {ffmpegError}
                  </span>
                ) : (
                  "Initializing Local Engine..."
                )}
              </div>
            )}
          </div>
        </div>

        {/* নিচের ট্যাগস - ডার্ক মোডে বর্ডার ও টেক্সট কালার অ্যাড */}
        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2 font-bold hover:text-purple-600 dark:text-slate-300 transition-colors cursor-default"><Scissors size={20}/> Video Trim</div>
           <div className="flex items-center gap-2 font-bold hover:text-pink-600 dark:text-slate-300 transition-colors cursor-default"><Music size={20}/> Audio Extract</div>
           <div className="flex items-center gap-2 font-bold hover:text-blue-600 dark:text-slate-300 transition-colors cursor-default"><FileVideo size={20}/> Fast Encode</div>
        </div>
      </div>
    </div>
  );
}