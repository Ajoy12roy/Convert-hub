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
  RefreshCw // Added for background convert animation
} from 'lucide-react';

// ✅ Typewriter Component for Header
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
      iconBg: "bg-purple-50",
      isSpecialAnimated: true, // Flag for Video Converter background animation
    },
    {
      title: "Audio Converter",
      desc: "Transform MP3, WAV, AAC formats",
      icon: <Music className="w-6 h-6 text-purple-600 relative z-10" />,
      iconBg: "bg-purple-50",
    },
    {
      title: "Document Converter",
      desc: "Convert PDF, Word, Excel, PowerPoint",
      icon: <FileText className="w-6 h-6 text-purple-600 relative z-10" />,
      iconBg: "bg-purple-50",
    },
    {
      title: "Image Converter",
      desc: "Change JPG, PNG, WEBP, SVG formats",
      icon: <ImageIcon className="w-6 h-6 text-purple-600 relative z-10" />,
      iconBg: "bg-purple-50",
    },
    {
      title: "Code Converter",
      desc: "Convert JS, TS, CSS, Python, C++",
      icon: <Code2 className="w-6 h-6 text-purple-600 relative z-10" />,
      iconBg: "bg-purple-50",
    },
    {
      title: "Decimal to Binary",
      desc: "Convert decimal numbers to binary",
      icon: <Wrench className="w-6 h-6 text-purple-600 relative z-10" />,
      iconBg: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Section */}
      <div className="pt-16 pb-12 px-4 text-center animate-fade-in-down">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight min-h-[60px]">
          {/* Apply Typewriter Animation Here */}
          <TypewriterText text="All Conversion Tools" />
        </h1>
        <p className="text-slate-500 text-lg mb-10">
          Search and find the exact conversion tool you need.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for any conversion (e.g., 'pdf', 'decimal to binary')..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base placeholder:text-slate-400 hover:shadow-md"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCategories.map((tool, index) => (
            <div 
              key={index}
              className="animate-flip-in group relative overflow-hidden p-8 bg-white border border-gray-100 rounded-4xl hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              style={{ animationDelay: `${index * 150}ms` }} // Staggered delay for each card
            >
              {/* ✅ Specific Background Animation for Video Converter */}
              {tool.isSpecialAnimated && (
                <div className="absolute -right-6 -bottom-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500">
                  <RefreshCw className="w-48 h-48 animate-spin-slow text-purple-900" />
                </div>
              )}

              <div className="relative z-10">
                <div className={`w-14 h-14 ${tool.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Floating Button */}
      <div className="fixed bottom-8 right-8 animate-bounce">
        <button className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all duration-300">
          <HelpCircle className="w-6 h-6 text-slate-600 hover:text-purple-600 transition-colors" />
        </button>
      </div>

      {/* ✅ CSS Animations Config */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Card Entrance Flip Animation */
        @keyframes flipInY {
          0% { transform: perspective(1000px) rotateY(90deg); opacity: 0; }
          100% { transform: perspective(1000px) rotateY(0deg); opacity: 1; }
        }
        .animate-flip-in {
          animation: flipInY 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
          transform-origin: center;
        }

        /* Slow Spin for Background Icon */
        @keyframes spinSlow {
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 10s linear infinite;
        }

        /* Header Fade-in Down */
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
}