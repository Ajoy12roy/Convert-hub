"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Code2, ChevronRight, Copy, Check, Download, Loader2, RefreshCcw, Terminal, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

// টাইপরাইটার অ্যানিমেশন কম্পোনেন্ট
const TypewriterText = ({
  text,
  delay = 0,
  speed = 50,
  cursor = true
}: {
  text: string;
  delay?: number;
  speed?: number;
  cursor?: boolean;
}) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    let timer: NodeJS.Timeout;

    const startTyping = () => {
      timer = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i)); // ✅ FIX HERE
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
      {cursor && (
        <span className="animate-pulse text-purple-400 font-light ml-1">
          |
        </span>
      )}
    </span>
  );
};

const languages = [
  { name: 'C', color: 'bg-blue-600', hover: 'hover:bg-blue-700', shadow: 'shadow-blue-200', text: 'text-blue-500' },
  { name: 'C++', color: 'bg-amber-500', hover: 'hover:bg-amber-600', shadow: 'shadow-amber-300', text: 'text-blue-600' },
  { name: 'Java', color: 'bg-red-500', hover: 'hover:bg-red-600', shadow: 'shadow-red-200', text: 'text-red-500' },
  { name: 'Python', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600', shadow: 'shadow-yellow-200', text: 'text-yellow-600' },
  { name: 'JavaScript', color: 'bg-lime-400', hover: 'hover:bg-lime-500', shadow: 'shadow-lime-200', text: 'text-yellow-500' },
  { name: 'TypeScript', color: 'bg-blue-500', hover: 'hover:bg-blue-600', shadow: 'shadow-blue-200', text: 'text-blue-500' },
  { name: 'C#', color: 'bg-purple-600', hover: 'hover:bg-purple-700', shadow: 'shadow-purple-200', text: 'text-purple-500' },
  { name: 'Go', color: 'bg-cyan-500', hover: 'hover:bg-cyan-600', shadow: 'shadow-cyan-200', text: 'text-cyan-500' },
  { name: 'Rust', color: 'bg-orange-600', hover: 'hover:bg-orange-700', shadow: 'shadow-orange-200', text: 'text-orange-600' },
  { name: 'Swift', color: 'bg-rose-500', hover: 'hover:bg-rose-600', shadow: 'shadow-rose-200', text: 'text-orange-500' },
  { name: 'HTML', color: 'bg-fuchsia-700', hover: 'hover:bg-bg-fuchsia-800', shadow: 'shadow-fuchsia-200', text: 'text-orange-400' },
  { name: 'CSS', color: 'bg-green-500', hover: 'hover:bg-green-700', shadow: 'shadow-green-200', text: 'text-blue-400' },
  { name: 'SCSS', color: 'bg-pink-500', hover: 'hover:bg-pink-600', shadow: 'shadow-pink-200', text: 'text-pink-500' },
  { name: 'Tailwind CSS', color: 'bg-teal-400', hover: 'hover:bg-teal-500', shadow: 'shadow-teal-200', text: 'text-teal-400' }
];

export default function CodeConverterPage() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [targetLang, setTargetLang] = useState('Python');
  const [isConverting, setIsConverting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToHistory } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

  const activeFormat = languages.find(l => l.name === targetLang) || languages[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setInputCode(event.target?.result as string);
      toast.success(`${file.name} loaded!`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

 const handleConvert = async () => {
    // ... আগের স্টেট চেকগুলো থাকবে
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    // কনসোলে চেক করুন কি-টি ঠিকমতো পাচ্ছে কিনা (শুধুমাত্র টেস্টের জন্য)
    console.log("Using API Key:", API_KEY?.substring(0, 5) + "...");

    try {
      // এই URL ফরম্যাটটি ব্যবহার করুন
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Convert this code to ${targetLang}. Only output the code: \n\n${inputCode}`
              }]
            }]
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        // যদি ৪MDG বা অন্য এরর আসে, তবে এখানে মডেল লিস্ট দেখার চেষ্টা করবে
        console.error("Gemini Error Details:", data.error);
        toast.error(`API Error: ${data.error.message}`);
        return;
      }
      
      // আউটপুট সেট করা
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setOutputCode(data.candidates[0].content.parts[0].text.replace(/```[\w]*\n/g, '').replace(/```/g, ''));
addToHistory("Code Converter", `Converted to ${targetLang}`);
        toast.success("Converted!");
      }
    } catch (err) {
      console.error("Network Error:", err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  // ডাউনলোড ও সেভ অপশন
  const handleDownload = async () => {
    if (!outputCode) return;

    const extensionMap: Record<string, string> = {
      'C': 'c', 'C++': 'cpp', 'Java': 'java', 'Python': 'py', 
      'JavaScript': 'js', 'TypeScript': 'ts', 'C#': 'cs', 'Go': 'go', 
      'Rust': 'rs', 'Swift': 'swift', 'HTML': 'html', 'CSS': 'css', 
      'SCSS': 'scss', 'Tailwind CSS': 'html'
    };
    const ext = extensionMap[targetLang] || 'txt';
    const suggestedName = `converted-code.${ext}`;

    if ('showSaveFilePicker' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: suggestedName,
          types: [{
            description: `${targetLang} File`,
            accept: { 'text/plain': [`.${ext}`] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(outputCode);
        await writable.close();
        toast.success("File saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
          toast.error("Failed to save file.");
        }
      }
    } else {
      const blob = new Blob([outputCode], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = suggestedName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Downloading file...");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 flex flex-col items-center font-sans ">
      <Toaster position="top-right" />
      
      <div className={`w-full max-w-7xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* Header Section */}
        <div className="text-center mb-24 mt-8 h-32">
          <div className="flex justify-center mb-4">
             <div className="bg-purple-100 p-4 rounded-3xl text-purple-600 shadow-sm transition-transform hover:scale-110 duration-300">
               <Code2 size={40} />
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic uppercase">
            <TypewriterText text="Code Converter" speed={100} cursor={false} />
          </h1>
          <p className="text-slate-500 mt-3 font-medium text-lg italic">
            <TypewriterText text="Translate languages, format structures, and optimize logic." delay={1500} speed={40} />
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
          {/* Input Box */}
          <div className="w-full flex-1 bg-[#0F172A] rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1E293B] border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold font-mono">
                <Terminal size={16} /> Input Code
              </div>
              <div className="flex items-center gap-3">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 shadow-inner">
                  <Upload size={14} className="text-emerald-400" /> Upload
                </button>
              </div>
            </div>
            <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="Paste code or upload file..." className="w-full h-100 bg-transparent text-emerald-400 font-mono p-6 outline-none resize-none" />
          </div>

          <div className="flex items-center justify-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 ${activeFormat.color} animate-pulse`}>
              <ChevronRight size={28} />
            </div>
          </div>

          {/* Output Box */}
          <div className="w-full flex-1 bg-[#0F172A] rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between px-6 py-4 bg-[#1E293B] border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold font-mono">
                <Code2 size={16} /> Output Code
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold font-mono ${activeFormat.text}`}>{targetLang}</div>
                <button onClick={handleCopy} disabled={!outputCode} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg">
                  {isCopied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            <textarea readOnly value={outputCode} placeholder="Converted output..." className="w-full h-[400px] bg-transparent text-blue-300 font-mono p-6 outline-none resize-none" />
          </div>
        </div>

        {/* Selection & Convert UI */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {languages.map((lang) => (
              <button key={lang.name} onClick={() => setTargetLang(lang.name)} className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform ${targetLang === lang.name ? `${lang.color} text-white scale-110 shadow-xl ring-8 ring-white` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {lang.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 max-w-3xl mx-auto">
            <button onClick={handleConvert} disabled={isConverting || !inputCode} className={`group flex-1 w-full text-white px-10 py-6 rounded-3xl font-black text-2xl flex items-center justify-center gap-4 shadow-2xl transition-all duration-500 disabled:opacity-80 ${activeFormat.color} ${activeFormat.hover} ${activeFormat.shadow}`}>
              {isConverting ? <Loader2 className="animate-spin" /> : <RefreshCcw className="group-hover:rotate-180 transition-transform duration-700" />}
              {isConverting ? "Processing..." : `Convert to ${targetLang}`}
            </button>

            {outputCode && (
              <button onClick={handleDownload} className="w-full sm:w-auto px-10 py-6 bg-slate-900 text-white rounded-3xl font-black text-2xl flex items-center justify-center gap-3 shadow-2xl hover:bg-black transition-all hover:-translate-y-2">
                <Download className="animate-bounce" /> Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}