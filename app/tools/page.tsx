"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Video, 
  Music, 
  FileText, 
  Image as ImageIcon, 
  Code2, 
  Wrench,
  HelpCircle,
  RefreshCw 
} from 'lucide-react';

const TypewriterText = ({ text, speed = 80 }: { text: string; speed?: number }) => {
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
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [text, speed]);

  return (
    <span className="relative">
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} inline-block w-[4px] h-[0.9em] bg-purple-600 ml-1 align-middle transition-opacity duration-100`} />
    </span>
  );
};

export default function ToolsPage() {
  const toolCategories = [
    {
      title: "Video Converter",
      desc: "Convert MP4, MOV, AVI, and more",
      icon: <Video className="w-6 h-6 text-purple-600 relative z-10" />,
      iconBg: "bg-purple-100/50",
      bgIconColor: "text-purple-500",
    },
    {
      title: "Audio Converter",
      desc: "Transform MP3, WAV, AAC formats",
      icon: <Music className="w-6 h-6 text-blue-600 relative z-10" />,
      iconBg: "bg-blue-100/50",
      bgIconColor: "text-blue-500",
    },
    {
      title: "Document Converter",
      desc: "Convert PDF, Word, Excel, PowerPoint",
      icon: <FileText className="w-6 h-6 text-emerald-600 relative z-10" />,
      iconBg: "bg-emerald-100/50",
      bgIconColor: "text-emerald-500",
    },
    {
      title: "Image Converter",
      desc: "Change JPG, PNG, WEBP, SVG formats",
      icon: <ImageIcon className="w-6 h-6 text-amber-600 relative z-10" />,
      iconBg: "bg-amber-100/50",
      bgIconColor: "text-amber-500",
    },
    {
      title: "Code Converter",
      desc: "Convert JS, TS, CSS, Python, C++",
      icon: <Code2 className="w-6 h-6 text-pink-600 relative z-10" />,
      iconBg: "bg-pink-100/50",
      bgIconColor: "text-pink-500",
    },
    {
      title: "Decimal to Binary",
      desc: "Convert decimal numbers to binary",
      icon: <Wrench className="w-6 h-6 text-indigo-600 relative z-10" />,
      iconBg: "bg-indigo-100/50",
      bgIconColor: "text-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 overflow-hidden relative">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-200/40 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Section */}
      <div className="pt-20 pb-12 px-4 text-center animate-fade-in-down relative z-10">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight min-h-[60px]">
          <TypewriterText text="All Conversion Tools" />
        </h1>
        <p className="text-slate-500 text-lg mb-10">
          Search and find the exact conversion tool you need.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for any conversion (e.g., 'pdf', 'decimal to binary')...."
            className="w-full pl-14 pr-6 py-4 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all text-base placeholder:text-slate-400 hover:bg-white/80"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolCategories.map((tool, index) => (
            <div key={index} className="perspective-container">
              {/* ✅ RGB Glass Card */}
              <div 
                className={`rgb-glass-card group relative overflow-hidden p-8 rounded-[2rem] cursor-pointer 
                  ${index % 2 === 0 ? 'hover-flip-right' : 'hover-flip-left'}
                `}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background Rotating Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] group-hover:opacity-0 transition-opacity duration-500 z-0">
                  <RefreshCw 
                    className={`w-56 h-56 ${tool.bgIconColor} ${index % 2 === 0 ? 'animate-spin-slow' : 'animate-spin-reverse-slow'}`} 
                  />
                </div>

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Icon Flip Wrapper */}
                  <div className={`icon-flip-wrapper w-14 h-14 ${tool.iconBg} border border-white rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                    {tool.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                    {tool.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Floating Button */}
      <div className="fixed bottom-8 right-8 animate-bounce z-50">
        <button className="w-12 h-12 bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full flex items-center justify-center hover:bg-purple-50 hover:border-purple-200 transition-all duration-300">
          <HelpCircle className="w-6 h-6 text-slate-500 hover:text-purple-600 transition-colors" />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* ✅ Base Card Setup */
        .rgb-glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          position: relative;
          z-index: 1;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
          
          /* Set border transparent so the mask ::before shows through */
          border: 2px solid transparent; 
          background-clip: padding-box;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
        }

        /* 🌈 1. RGB Border (Always Visible Before & After Hover) */
        .rgb-glass-card::before {
          content: '';
          position: absolute;
          inset: -2px; /* Pulls element out to cover the border area */
          border-radius: inherit;
          padding: 2px; /* Border thickness */
          background: linear-gradient(45deg, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
          background-size: 400% 400%;
          animation: rgbMove 8s linear infinite;
          
          /* Mask to keep only the border visible */
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          
          opacity: 0.8; /* Visible by default */
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: -1;
        }

        /* 🌈 2. RGB Full Card Fill (Visible ONLY ON HOVER) */
        .rgb-glass-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(45deg, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
          background-size: 400% 400%;
          animation: rgbMove 8s linear infinite;
          
          opacity: 0; /* Hidden by default */
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 0; /* Keeps it under the text but over the white background */
        }

        /* Hover Actions */
        .rgb-glass-card:hover {
          box-shadow: 0 20px 40px -10px rgba(168, 85, 247, 0.2); /* Soft purple glow */
        }

        .rgb-glass-card:hover::before {
          opacity: 1; /* Brighten the border */
        }

        .rgb-glass-card:hover::after {
          opacity: 0.12; /* Fills the whole card with the RGB colors! */
        }

        @keyframes rgbMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* 3D Hover Flip Logic */
        .perspective-container { perspective: 1200px; }
        .hover-flip-right:hover { transform: rotateY(12deg) rotateX(5deg) translateY(-8px); }
        .hover-flip-left:hover { transform: rotateY(-12deg) rotateX(5deg) translateY(-8px); }

        /* 3D Icon Flip */
        .icon-flip-wrapper {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .group:hover .icon-flip-wrapper { transform: rotateY(360deg); }

        /* Spinner Animations */
        @keyframes spinSlow { 100% { transform: rotate(360deg); } }
        @keyframes spinReverseSlow { 100% { transform: rotate(-360deg); } }
        .animate-spin-slow { animation: spinSlow 15s linear infinite; }
        .animate-spin-reverse-slow { animation: spinReverseSlow 15s linear infinite; }

        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
      `}} />
    </div>
  );
}