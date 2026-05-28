"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Download, RefreshCcw, Loader2, FileType, Layers, FileSearch, FileCode, BookOpen } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

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
    <span>{displayText}{cursor && <span className="animate-pulse text-purple-400 font-light ml-1">|</span>}</span>
  );
};

export default function DocumentToolsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('DOCX');
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>(''); 
  const [mounted, setMounted] = useState(false);
  const { addToHistory } = useAuthStore() as unknown as { addToHistory: (category: string, action: string) => void };

  const formats = [
    { name: 'DOCX', color: 'bg-blue-600', hover: 'hover:bg-blue-700', shadow: 'shadow-blue-200' },
    { name: 'PDF', color: 'bg-red-500', hover: 'hover:bg-red-600', shadow: 'shadow-red-200' },
    { name: 'TXT', color: 'bg-slate-700', hover: 'hover:bg-slate-800', shadow: 'shadow-slate-200' },
    { name: 'PPTX', color: 'bg-orange-500', hover: 'hover:bg-orange-600', shadow: 'shadow-orange-200' },
    { name: 'XLSX', color: 'bg-emerald-600', hover: 'hover:bg-emerald-700', shadow: 'shadow-emerald-200' },
    { name: 'HTML', color: 'bg-cyan-500', hover: 'hover:bg-cyan-600', shadow: 'shadow-cyan-200' }
  ];

  const activeFormat = formats.find(f => f.name === targetFormat) || formats[0];

  useEffect(() => { setMounted(true); }, []);

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);
    setDownloadUrl('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', targetFormat.toLowerCase());
      
      const response = await fetch('/api/convert', { method: 'POST', body: formData });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Conversion failed. Please check API credentials.');
      }
      
      if (data.url) {
        setDownloadUrl(data.url);
        if(addToHistory) addToHistory("Document Tool", `Convert to ${targetFormat}`);
        toast.success("Conversion Complete!");
      } else if (data.FileData) {
        const base64DataUrl = `data:application/octet-stream;base64,${data.FileData}`;
        setDownloadUrl(base64DataUrl);
        if(addToHistory) addToHistory("Document Tool", `Convert to ${targetFormat}`);
        toast.success("Conversion Complete!");
      } else {
        throw new Error("No download data received from server");
      }
    } catch (err: unknown) {
      // ✅ ESLint Error fixed by using unknown instead of any
      const errorMessage = err instanceof Error ? err.message : "API Error! Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handleSaveAs = async () => {
    if (!downloadUrl) return;
    const defaultName = `C&D_converted_${file?.name.split('.')[0] || 'document'}.${targetFormat.toLowerCase()}`;
    try {
      // ✅ TS Error fixed using specific types and @ts-ignore for the modern Web API
      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
        // @ts-ignore
        const handle = await window.showSaveFilePicker({
          suggestedName: defaultName,
          types: [{ description: `${targetFormat} File`, accept: { '*/*': [`.${targetFormat.toLowerCase()}`] } }],
        });
        
        const writable = await handle.createWritable();
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        await writable.write(blob);
        await writable.close();
        
        toast.success("File saved locally!");
      } else {
        // Fallback for browsers that don't support showSaveFilePicker
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = defaultName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: unknown) {
       // ✅ ESLint Error fixed here too
      if (err instanceof Error && err.name !== 'AbortError') {
        toast.error("Save failed or cancelled.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 p-4 md:p-10 flex items-center justify-center font-sans overflow-hidden transition-colors duration-300">
      <Toaster />
      <div className={`w-full max-w-6xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-[3rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-1000 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        <div className="text-center mb-20 h-24">
          <div className="flex justify-center mb-2">
             <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-2xl text-purple-600 dark:text-purple-400"><FileText size={32} /></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight italic">
            <TypewriterText text="Document Tools" speed={80} cursor={false} />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
            <TypewriterText text="Fast, Secure & API Powered Processing" delay={1500} speed={40} />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className={`absolute -inset-1 ${activeFormat.color} rounded-[2.5rem] blur opacity-30 transition-all duration-500`}></div>
            <div className="relative aspect-video bg-white dark:bg-slate-800/50 rounded-4xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 transition-all group-hover:border-purple-400 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800">
              <input type="file" onChange={(e) => {setFile(e.target.files?.[0] || null); setDownloadUrl('');}} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {file ? (
                <div className="text-center">
                  <div className={`w-20 h-20 ${activeFormat.color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl text-white`}><FileType size={40} /></div>
                  <p className="text-slate-900 dark:text-white font-bold text-xl truncate max-w-62.5">{file.name}</p>
                </div>
              ) : (
                <div className="text-center">
                   <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4"><Layers className="text-slate-400 dark:text-slate-500" size={32} /></div>
                   <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">Select Document</h3>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-wrap gap-3 mt-4">
              {formats.map((fmt) => (
                <button key={fmt.name} onClick={() => {setTargetFormat(fmt.name); setDownloadUrl('');}} className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform ${targetFormat === fmt.name ? `${fmt.color} text-white scale-110 shadow-lg ${fmt.shadow} ring-4 ring-white dark:ring-slate-900` : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                  {fmt.name}
                </button>
              ))}
            </div>

            <div className="pt-4">
              {!downloadUrl ? (
                <button onClick={handleConvert} disabled={isConverting || !file} className={`group relative w-full md:w-auto overflow-hidden text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 shadow-2xl transition-all duration-500 disabled:opacity-90 ${activeFormat.color} ${activeFormat.hover} ${activeFormat.shadow}`}>
                  {isConverting ? <Loader2 className="animate-spin" /> : <RefreshCcw className="group-hover:rotate-180 transition-transform duration-700" />}
                  {isConverting ? "Processing..." : `Convert to ${targetFormat}`}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleSaveAs} className="flex-1 px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600 transition-all hover:-translate-y-1">
                    <Download className="animate-bounce" /> Save As...
                  </button>
                  <button onClick={() => {setFile(null); setDownloadUrl('');}} className="group px-6 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                    <RefreshCcw className="group-hover:-rotate-180 transition-transform duration-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 dark:text-slate-400">
           <div className="flex items-center gap-2 font-bold hover:text-red-600 transition-colors cursor-default"><FileSearch size={20}/> OCR Scan</div>
           <div className="flex items-center gap-2 font-bold hover:text-blue-600 transition-colors cursor-default"><FileCode size={20}/> JSON Export</div>
           <div className="flex items-center gap-2 font-bold hover:text-orange-600 transition-colors cursor-default"><BookOpen size={20}/> E-Book Ready</div>
        </div>
      </div>
    </div>
  );
}