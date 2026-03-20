"use client";

import React, { useState, useRef } from 'react';
import { Download, RefreshCw, Loader2, Image as ImageLucide } from 'lucide-react';

export default function ImageToolsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ১. ইমেজটি বেস৬৪ ফরম্যাটে রূপান্তর
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      setOriginalImage(base64);
      setIsProcessing(true);

      try {
        // ২. আমাদের ব্যাকএন্ড এপিআই কল করা
        const response = await fetch('/api/remove-bg', {
          method: 'POST',
          body: JSON.stringify({ image: base64 }),
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        
        if (data.url) {
          setProcessedImage(data.url); // সফল হলে ইমেজের ইউআরএল সেট হবে
        } else {
          alert("Error: " + data.error);
        }
      } catch (err) {
        alert("Failed to connect to the server.");
      } finally {
        setIsProcessing(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-4xl mx-auto">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

        {!originalImage ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-[2rem] py-24 text-center cursor-pointer bg-white">
             <ImageLucide className="w-12 h-12 mx-auto text-gray-300 mb-4" />
             <p className="font-bold text-slate-700">Click to Upload Image</p>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[2rem] shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-center text-sm font-bold text-slate-400 mb-4 uppercase">Original</p>
                <img src={originalImage} className="rounded-2xl w-full aspect-square object-cover" />
              </div>
              <div className="relative">
                <p className="text-center text-sm font-bold text-purple-500 mb-4 uppercase">AI Result</p>
                <div className="rounded-2xl w-full aspect-square bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-gray-100 flex items-center justify-center overflow-hidden">
                  {isProcessing ? (
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-2" />
                      <p className="text-xs font-bold">Removing Background...</p>
                    </div>
                  ) : (
                    processedImage && <img src={processedImage} className="w-full h-full object-contain" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => {setOriginalImage(null); setProcessedImage(null);}} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Try Another</button>
              {processedImage && (
                <a href={processedImage} download className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200">Download HD PNG</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}