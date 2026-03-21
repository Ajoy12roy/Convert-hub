"use client";

import React, { useState, useRef } from 'react';
import { Download, Loader2, Image as ImageLucide, X, UploadCloud, ArrowRight } from 'lucide-react';
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageToolsPage() {
  // --- Background Remover States ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showBgModal, setShowBgModal] = useState(false);
  const [bgFileName, setBgFileName] = useState("converthub-bg-removed");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Format Converter States ---
  const [converterFile, setConverterFile] = useState<File | null>(null);
  const [converterPreview, setConverterPreview] = useState<string | null>(null);
  const [converterProcessedUrl, setConverterProcessedUrl] = useState<string | null>(null);
  const [converterIsProcessing, setConverterIsProcessing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('JPG');
  const [showConvModal, setShowConvModal] = useState(false);
  const [convFileName, setConvFileName] = useState("converthub-converted");
  const converterFileInputRef = useRef<HTMLInputElement>(null);

  const formats = ['JPG', 'PNG', 'WEBP', 'GIF', 'BMP', 'SVG', 'ICO', 'TIFF'];

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
      const response = await fetch('/api/remove-bg', { method: 'POST', body: formData });
      const data = await response.json();
      if (response.ok && data.url) setProcessedImage(data.url);
      else alert(data.error || "প্রসেসিং ব্যর্থ হয়েছে।");
    } catch {
      alert("সার্ভার কানেকশন এরর।");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmBgDownload = async () => {
    if (!processedImage) return;
    setShowBgModal(false);
    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bgFileName || 'image'}.png`; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("ডাউনলোড করতে সমস্যা হচ্ছে!");
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
      };
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 relative">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      <input type="file" ref={converterFileInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setConverterFile(file);
          setConverterPreview(URL.createObjectURL(file));
        }
      }} className="hidden" accept="image/*" />
      
      <AnimatePresence>
        {/* Modal logic updated to prevent JSX errors */}
        {showBgModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Save Result As</h3>
                <button onClick={() => setShowBgModal(false)}><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              <input type="text" value={bgFileName} onChange={(e) => setBgFileName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setShowBgModal(false)} className="flex-1 px-6 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <button onClick={confirmBgDownload} className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold">Download</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-4xl font-extrabold mb-2 text-slate-900"><span className="text-[#E6238F]">Image</span> Tool</h1>
        <p className="text-xl text-slate-600">Background removal & format conversion — with instant download</p>
      </motion.div>

      {/* AI Background Remover Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-slate-200 mb-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">AI Background Remover</h2>
        {!originalImage ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-2xl p-20 text-center cursor-pointer hover:border-purple-500">
            <ImageLucide className="w-12 h-12 mx-auto text-purple-500 mb-2" />
             <button className="mt-4 bg-linear-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold">Choose Image</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-square rounded-xl overflow-hidden border">
              <Image src={originalImage} alt="Original" fill className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-xl bg-slate-100 border overflow-hidden flex items-center justify-center">
              {isProcessing ? <Loader2 className="w-10 h-10 animate-spin text-purple-600" /> : processedImage && <Image src={processedImage} alt="Result" fill className="object-contain" unoptimized />}
            </div>
          </div>
        )}
        {originalImage && (
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={() => {setOriginalImage(null); setProcessedImage(null);}} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Reset</button>
            {processedImage && <button onClick={() => setShowBgModal(true)} className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2"><Download className="w-5 h-5" /> Download PNG</button>}
          </div>
        )}
      </motion.div>

      {/* Format Conversion Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-slate-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Format Conversion</h2>
        {!converterPreview ? (
          <div onClick={() => converterFileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center cursor-pointer hover:border-purple-500">
            <UploadCloud className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <p className="text-xl font-bold">Upload Your Image</p>
            <button className="mt-4 bg-linear-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold">Choose Image</button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 relative rounded-2xl overflow-hidden border-4 border-white shadow-md">
              <Image src={converterPreview} alt="To convert" fill className="object-cover" />
            </div>
            <div className="flex-1 text-center">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {formats.map(f => (
                  <button key={f} onClick={() => setSelectedFormat(f)} className={`px-4 py-2 rounded-xl text-sm font-bold ${selectedFormat === f ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{f}</button>
                ))}
              </div>
              {!converterProcessedUrl ? (
                <button onClick={handleConvertFormat} disabled={converterIsProcessing} className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto">
                  {converterIsProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />} Convert to {selectedFormat}
                </button>
              ) : (
                <button onClick={() => setShowConvModal(true)} className="bg-green-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto"><Download className="w-5 h-5" /> Download Result</button>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Format Converter Modal */}
      <AnimatePresence>
        {showConvModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold mb-6">Save {selectedFormat} As</h3>
              <input type="text" value={convFileName} onChange={(e) => setConvFileName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setShowConvModal(false)} className="flex-1 px-6 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <a href={converterProcessedUrl!} download={`${convFileName}.${selectedFormat.toLowerCase()}`} onClick={() => setShowConvModal(false)} className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-xl font-bold text-center">Download</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}