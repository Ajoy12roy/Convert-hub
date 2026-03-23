"use client";

import React from 'react';
import { Upload, FileVideo } from 'lucide-react';

export default function VideoConverterSection() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f8f9fc] flex justify-center pt-12 px-4 pb-20 font-sans">
      <div className="w-full max-w-225 bg-white rounded-4xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
        
        <h1 className="text-[28px] font-bold text-[#111827] mb-8">Main Video Converter</h1>

        {/* Upload Dropzone */}
        <div className="w-full border-[1.5px] border-dashed border-gray-300 rounded-4xl pt-16 pb-12 px-8 flex flex-col items-center justify-center relative bg-gray-50/30 transition-all hover:bg-gray-50/80 group">
          
          {/* Gradient Icon Box */}
          <div className="w-22 h-22 rounded-3xl bg-linear-to-br from-[#5b4fe8] to-[#ab4cfa] flex items-center justify-center shadow-[0_10px_25px_rgba(139,92,246,0.3)] mb-6 transition-transform group-hover:scale-105">
            <FileVideo className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-[32px] font-extrabold text-[#0f172a] mb-3 tracking-tight">Upload Your Video</h2>
          
          <p className="text-gray-500 text-[15px] text-center max-w-100 mb-8 leading-relaxed">
            Drag & drop or click to browse. Supports MP4, WebM, MOV, AVI, MKV, MP3, WAV
          </p>

          {/* Action Button */}
          <button className="bg-linear-to-r from-[#5b4fe8] to-[#ab4cfa] hover:opacity-95 transition-all active:scale-[0.98] text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] flex items-center gap-2.5 shadow-md">
            <Upload className="w-4.5 h-4.5" strokeWidth={2.5} />
            Choose File
          </button>

          {/* Supported Formats Tags */}
          <div className="flex flex-wrap gap-2.5 justify-center mt-12">
            {['MP4', 'WebM', 'MOV', 'AVI', 'MKV', 'MP3', 'WAV'].map((format) => (
              <span 
                key={format} 
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-[13px] font-semibold text-gray-500 shadow-sm hover:border-purple-200 transition-colors"
              >
                {format}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}