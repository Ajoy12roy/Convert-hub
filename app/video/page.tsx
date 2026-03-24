"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Upload, FileVideo, Loader2, Download, RefreshCcw, Play, Scissors, Music } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- কাস্টম টাইপরাইটার অ্যানিমেশন কম্পোনেন্ট ---
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

    return () => {
      clearTimeout(initialDelay);
      clearInterval(timer);
    };
  }, [text, delay, speed]);

  return (
    <span>
      {displayText}
      {cursor && <span className="animate-pulse text-purple-400 font-light ml-1">|</span>}
    </span>
  );
};
// ----------------------------------------------

export default function VideoConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('MP3');
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false); // পুরো পেজ লোড অ্যানিমেশনের জন্য
  
  const ffmpegRef = useRef(new FFmpeg());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formats = [
    { name: 'MP3', color: 'bg-purple-500', hover: 'hover:bg-purple-600', shadow: 'shadow-purple-200' },
    { name: 'MP4', color: 'bg-blue-500', hover: 'hover:bg-blue-600', shadow: 'shadow-blue-200' },
    { name: 'WAV', color: 'bg-pink-500', hover: 'hover:bg-pink-600', shadow: 'shadow-pink-200' },
    { name: 'MKV', color: 'bg-indigo-500', hover: 'hover:bg-indigo-600', shadow: 'shadow-indigo-200' },
    { name: 'AVI', color: 'bg-cyan-500', hover: 'hover:bg-cyan-600', shadow: 'shadow-cyan-200' },
    { name: 'MOV', color: 'bg-rose-500', hover: 'hover:bg-rose-600', shadow: 'shadow-rose-200' },
    { name: 'WEBM', color:'bg-orange-500', hover: 'hover:bg-orange-600', shadow: 'shadow-orange-200' }
  ];

  const activeFormat = formats.find(f => f.name === targetFormat) || formats[0];

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
  };

  useEffect(() => { 
    load(); 
    setMounted(true); // পেজ লোড হওয়ার সাথে সাথে অ্যানিমেশন ট্রিগার করবে
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const url = URL.createObjectURL(new Blob([(data as any).buffer]));
      setDownloadUrl(url);
      toast.success("Conversion Complete!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Conversion failed!");
    } finally {
      setIsConverting(false);
    }
  };

  // --- আপডেট করা ডাউনলোড লজিক (Save As Dialog) ---
  const handleDownload = async () => {
    const defaultFileName = `C&D_converted_${file?.name.split('.')[0] || 'media'}.${targetFormat.toLowerCase()}`;
    const mimeType = ['MP3', 'WAV'].includes(targetFormat) ? 'audio' : 'video';
    const extension = `.${targetFormat.toLowerCase()}`;

    try {
      // চেক করা হচ্ছে ব্রাউজারে File System Access API সাপোর্ট করে কি না
      if ('showSaveFilePicker' in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: defaultFileName,
          types: [{
            description: `${targetFormat} File`,
            accept: { [`${mimeType}/${targetFormat.toLowerCase()}`]: [extension] },
          }],
        });
        
        const writable = await handle.createWritable();
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        await writable.write(blob);
        await writable.close();
        
        toast.success("File saved successfully!");
      } else {
        // ফলব্যাক: যদি ব্রাউজারে API সাপোর্ট না থাকে (যেমন Firefox/Safari)
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = defaultFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Save failed:", err);
        toast.error("Failed to save the file.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 flex items-center justify-center font-sans overflow-hidden">
      <Toaster />
      
      {/* মেইন গ্লাস-মরফিজম কার্ড */}
      <div className={`w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/40 rounded-[3rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-1000 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* অ্যানিমেটেড হেডিং সেকশন */}
        <div className="text-center mb-12 h-24">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic">
            <TypewriterText text="Format Conversion" speed={80} cursor={false} />
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-lg">
            <TypewriterText text="Fast, Secure & Local Processing" delay={1500} speed={40} />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* বাম পাশ: ভিডিও প্রিভিউ */}
          <div className="relative group">
            <div className={`absolute -inset-1 ${activeFormat.color} rounded-[2.5rem] blur opacity-40 transition-all duration-500`}></div>
            <div className="relative aspect-video bg-slate-900 rounded-4xl overflow-hidden shadow-2xl flex items-center justify-center border border-white/20">
              {previewUrl ? (
                <video src={previewUrl} controls className="w-full h-full object-cover" />
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-center cursor-pointer p-10 group"
                >
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Play className="text-white fill-white ml-1" size={32} />
                  </div>
                  <p className="text-white/60 font-bold text-lg">Select Video to Preview</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="video/*" />
          </div>

          {/* ডান পাশ: কনভার্সন কন্ট্রোল */}
          <div className="space-y-8">
            <div>
              <label className="text-slate-400 text-sm font-bold uppercase tracking-widest ml-1">Select Output Format</label>
              <div className="flex flex-wrap gap-3 mt-4">
                {formats.map((fmt) => (
                  <button
                    key={fmt.name}
                    onClick={() => setTargetFormat(fmt.name)}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform ${
                      targetFormat === fmt.name 
                      ? `${fmt.color} text-white scale-110 shadow-lg ${fmt.shadow} ring-4 ring-white` 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
                  {isConverting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <RefreshCcw className="group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                  )}
                  {isConverting ? "Processing..." : `Convert to ${targetFormat}`}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* আপডেট করা ডাউনলোড বাটন */}
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600 transition-all hover:-translate-y-1"
                  >
                    <Download className="animate-bounce" /> Save As...
                  </button>
                  <button 
                    onClick={() => {setFile(null); setDownloadUrl(''); setPreviewUrl('');}}
                    className="group px-6 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    <RefreshCcw className="group-hover:-rotate-180 transition-transform duration-500" />
                  </button>
                </div>
              )}
            </div>

            {!loaded && (
              <div className="flex items-center gap-3 text-slate-600 font-bold text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 animate-pulse transition-opacity duration-1000">
                <Loader2 size={20} className="animate-spin" />
                Initializing Local Engine...
              </div>
            )}
          </div>

        </div>

        {/* নিচের সাপোর্ট ট্যাগস */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2 font-bold hover:text-purple-600 transition-colors cursor-default"><Scissors size={20}/> Video Trim</div>
           <div className="flex items-center gap-2 font-bold hover:text-pink-600 transition-colors cursor-default"><Music size={20}/> Audio Extract</div>
           <div className="flex items-center gap-2 font-bold hover:text-blue-600 transition-colors cursor-default"><FileVideo size={20}/> Fast Encode</div>
        </div>

      </div>
    </div>
  );
}