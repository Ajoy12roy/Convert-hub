"use client";

import React, { useState, useRef } from 'react';
import { Download, Loader2, Image as ImageLucide, UploadCloud, ArrowRight } from 'lucide-react';
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuthStore } from '@/store/useAuthStore';
import toast, { Toaster } from 'react-hot-toast'; 

export default function ImageToolsPage() {
  // --- Background Remover States ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Format Converter States ---
  const [converterFile, setConverterFile] = useState<File | null>(null);
  const [converterPreview, setConverterPreview] = useState<string | null>(null);
  const [converterProcessedUrl, setConverterProcessedUrl] = useState<string | null>(null);
  const [converterIsProcessing, setConverterIsProcessing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('JPG');
  const converterFileInputRef = useRef<HTMLInputElement>(null);

  const formats = ['JPG', 'PNG', 'WEBP', 'GIF', 'BMP', 'SVG', 'ICO', 'TIFF'];
  const { addToHistory } = useAuthStore() as any;

  // === Error-Free Native File Save Picker Function ===
  const handleSaveWithPicker = async (url: string, suggestedName: string, mimeType: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const win = window as any; // TypeScript Error বাইপাস করার জন্য

      // যদি ব্রাউজারে ফোল্ডার পিকার সাপোর্ট না করে (যেমন Firefox বা Mobile), তবে সাধারণ ডাউনলোড হবে
      if (!win.showSaveFilePicker) {
        const fallbackUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fallbackUrl;
        a.download = suggestedName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(fallbackUrl);
        toast.success("File downloaded successfully!");
        return;
      }

      // মডার্ন ব্রাউজারের জন্য ফোল্ডার পিকার
      const handle = await win.showSaveFilePicker({
        suggestedName: suggestedName,
        types: [{ description: 'Image File', accept: { [mimeType]: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.svg', '.ico', '.tiff'] } }],
      });
      
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      toast.success("File saved successfully!");
    } catch (err: any) {
      if (err.name !== 'AbortError') toast.error("Download failed or was cancelled.");
    }
  };

  // === Logic Functions ===
  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 2000;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob as Blob), 'image/jpeg', 0.7);
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessedImage(null);
    setOriginalImage(URL.createObjectURL(file));

    try {
      const compressedBlob = await resizeImage(file);
      
      const formData = new FormData();
      formData.append('image', compressedBlob, 'image.jpg');

      const response = await fetch('/api/remove-bg', { 
        method: 'POST', 
        body: formData 
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        setProcessedImage(data.url);
        if (addToHistory) addToHistory("Image Tool", "Background Removal");
        toast.success("Background removed successfully!");
      } else {
        throw new Error(data.error || "Processing failed.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Server connection error.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertFormat = async () => {
    if (!converterFile) return;
    setConverterIsProcessing(true);
    const reader = new FileReader();
    reader.readAsDataURL(converterFile);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL(`image/${selectedFormat.toLowerCase()}`);
        setConverterProcessedUrl(dataUrl);
        setConverterIsProcessing(false);
        if (addToHistory) addToHistory("Image Tool", `Convert to ${selectedFormat}`);
        toast.success(`Converted to ${selectedFormat}`);
      };
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-12 px-4 relative transition-colors duration-300">
      <Toaster />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      <input
        type="file"
        ref={converterFileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setConverterFile(file);
            setConverterPreview(URL.createObjectURL(file));
            setConverterProcessedUrl(null); 
          }
        }}
        className="hidden"
        accept="image/*"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-4xl font-extrabold mb-2 text-slate-900 dark:text-white">
          <span className="text-[#E6238F]">Image</span> Tool
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">Background removal & format conversion — with instant download</p>
      </motion.div>

      {/* AI Background Remover Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-slate-200 dark:border-slate-800 mb-6 transition-colors"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800 dark:text-white">AI Background Remover</h2>
        {!originalImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-20 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
          >
            <ImageLucide className="w-12 h-12 mx-auto text-purple-500 mb-2" />
            <button className="mt-4 bg-linear-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Choose Image
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-square rounded-xl overflow-hidden border dark:border-slate-700">
              <Image src={originalImage} alt="Original" fill className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-xl bg-slate-100 dark:bg-slate-800/50 border dark:border-slate-700 overflow-hidden flex items-center justify-center">
              {isProcessing ? (
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
              ) : (
                processedImage && <Image src={processedImage} alt="Result" fill className="object-contain" unoptimized />
              )}
            </div>
          </div>
        )}
        {originalImage && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => {
                setOriginalImage(null);
                setProcessedImage(null);
              }}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors"
            >
              Reset
            </button>
            {processedImage && (
              <button
                onClick={() => handleSaveWithPicker(processedImage, "converthub-bg-removed.png", "image/png")}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" /> Download PNG
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Format Conversion Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-slate-200 dark:border-slate-800 transition-colors"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Format Conversion</h2>
        {!converterPreview ? (
          <div
            onClick={() => converterFileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
          >
            <UploadCloud className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <p className="text-xl font-bold dark:text-white">Upload Your Image</p>
            <button className="mt-4 bg-linear-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Choose Image
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 relative rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-md">
              <Image src={converterPreview} alt="To convert" fill className="object-cover" />
            </div>
            <div className="flex-1 text-center">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => { setSelectedFormat(f); setConverterProcessedUrl(null); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      selectedFormat === f
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {!converterProcessedUrl ? (
                <button
                  onClick={handleConvertFormat}
                  disabled={converterIsProcessing}
                  className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {converterIsProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )} 
                  Convert to {selectedFormat}
                </button>
              ) : (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setConverterFile(null);
                      setConverterPreview(null);
                      setConverterProcessedUrl(null);
                    }}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleSaveWithPicker(
                      converterProcessedUrl, 
                      `converthub-converted.${selectedFormat.toLowerCase()}`, 
                      `image/${selectedFormat.toLowerCase()}`
                    )}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <Download className="w-5 h-5" /> Download Result
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}