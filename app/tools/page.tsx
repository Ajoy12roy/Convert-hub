"use client";

import React from 'react';
import { 
  Search, 
  Video, 
  Music, 
  FileText, 
  Image as ImageIcon, 
  Code2, 
  Wrench,
  HelpCircle 
} from 'lucide-react';

export default function ToolsPage() {
  const toolCategories = [
    {
      title: "Video Converter",
      desc: "Convert MP4, MOV, AVI, and more",
      icon: <Video className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-50",
    },
    {
      title: "Audio Converter",
      desc: "Transform MP3, WAV, AAC formats",
      icon: <Music className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-50",
    },
    {
      title: "Document Converter",
      desc: "Convert PDF, Word, Excel, PowerPoint",
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-50",
    },
    {
      title: "Image Converter",
      desc: "Change JPG, PNG, WEBP, SVG formats",
      icon: <ImageIcon className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-50",
    },
    {
      title: "Code Converter",
      desc: "Convert JS, TS, CSS, Python, C++",
      icon: <Code2 className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-50",
    },
    {
      title: "Decimal to Binary",
      desc: "Convert decimal numbers to binary",
      icon: <Wrench className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Section */}
      <div className="pt-16 pb-12 px-4 text-center">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          All Conversion Tools
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
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCategories.map((tool, index) => (
            <div 
              key={index}
              className="group p-8 bg-white border border-gray-100 rounded-4xl hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-14 h-14 ${tool.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {tool.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {tool.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Help Floating Button */}
      <div className="fixed bottom-8 right-8">
        <button className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <HelpCircle className="w-6 h-6 text-slate-600" />
        </button>
      </div>
    </div>
  );
}