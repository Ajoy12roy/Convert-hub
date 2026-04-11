"use client";

import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Settings, 
  Activity, 
  FileImage,
  FileText,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  // ✅ Image Upload State & Ref
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Trigger Hidden File Input
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Mock Data for Quick Tools
  const quickTools = [
    {
      title: "Image Converter",
      desc: "Convert images to different formats",
      icon: <ImageIcon className="w-6 h-6 text-emerald-600" />,
    },
    {
      title: "Resize & Optimize",
      desc: "Adjust dimensions and quality",
      icon: <Settings className="w-6 h-6 text-teal-600" />,
    },
    {
      title: "Batch Processing",
      desc: "Convert multiple files at once",
      icon: <Activity className="w-6 h-6 text-green-600" />,
    }
  ];

  // Mock Data for Recent Conversions
  const recentConversions = [
    {
      name: "photo_001.jpg",
      conversion: "JPG → PNG",
      time: "2 hours ago",
      icon: <FileImage className="w-5 h-5 text-emerald-500" />
    },
    {
      name: "document.pdf",
      conversion: "PDF → JPG",
      time: "1 day ago",
      icon: <FileText className="w-5 h-5 text-teal-500" />
    },
    {
      name: "design_final.png",
      conversion: "PNG → WEBP",
      time: "3 days ago",
      icon: <FileImage className="w-5 h-5 text-green-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4fcf6] text-slate-800 pb-24 relative overflow-hidden font-sans">
      
      {/* 🌿 Background Natural Light Green Ambient Glows */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-emerald-200/40 blur-[140px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute top-[40%] right-0 w-[600px] h-[600px] bg-teal-200/30 blur-[120px] rounded-full pointer-events-none translate-x-1/4"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 relative z-10">
        
        {/* ✅ Centered Header Section */}
        <div className="mb-14 text-center animate-fade-in-down">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">Profile</h1>
          <p className="text-slate-500 text-xl font-medium">Manage your account settings</p>
        </div>

        {/* 🟢 1. Profile Information Card (Enhanced Glassmorphism & Weight) */}
        <div className="bg-white/30 backdrop-blur-2xl border border-white/60 shadow-[0_12px_40px_rgba(16,185,129,0.08)] rounded-[2.5rem] p-10 md:p-14 mb-16 flex flex-col md:flex-row items-center md:items-start gap-14 animate-fade-in-up transition-all hover:bg-white/40 hover:shadow-[0_15px_50px_rgba(16,185,129,0.12)]">
          
          {/* ✅ Functional Avatar Section (Increased Size) */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={triggerImageUpload}>
              <div className="w-48 h-48 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden transition-transform duration-500 group-hover:scale-105 group-hover:shadow-emerald-500/20">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <Camera className="w-14 h-14 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                )}
              </div>
              
              {/* Upload Button */}
              <div className="absolute bottom-3 right-3 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-emerald-500 transition-all duration-300 hover:scale-110 active:scale-95 group-hover:animate-bounce">
                <Upload className="w-5 h-5" />
              </div>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          {/* Information Fields (Increased Weight & Beautiful Inputs) */}
          <div className="flex-grow w-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-white/50 pb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 tracking-wide uppercase">Full Name</label>
                <div className="w-full px-6 py-4 bg-white/40 backdrop-blur-md border border-white/70 rounded-2xl text-slate-800 font-medium shadow-sm hover:bg-white/60 transition-colors">
                  Alex Morrison
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 tracking-wide uppercase">Email Address</label>
                <div className="w-full px-6 py-4 bg-white/40 backdrop-blur-md border border-white/70 rounded-2xl text-slate-800 font-medium shadow-sm hover:bg-white/60 transition-colors">
                  alex.morrison@email.com
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 tracking-wide uppercase">Username</label>
                <div className="w-full px-6 py-4 bg-white/40 backdrop-blur-md border border-white/70 rounded-2xl text-slate-800 font-medium shadow-sm hover:bg-white/60 transition-colors">
                  @alexmorrison
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 tracking-wide uppercase">Account Role</label>
                <div className="w-full px-6 py-4 bg-emerald-50/50 backdrop-blur-md border border-emerald-200/50 rounded-2xl text-emerald-700 font-bold shadow-sm flex items-center justify-between">
                  Premium User
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🟢 2. Quick Tools Section */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 px-2">Quick Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickTools.map((tool, index) => (
              <div 
                key={index} 
                className="bg-white/30 backdrop-blur-2xl border border-white/60 shadow-sm hover:shadow-[0_12px_30px_rgba(16,185,129,0.12)] rounded-[2rem] p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 bg-white/70 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🟢 3. Recent Conversions Section */}
        <div>
          <div className="flex items-center gap-3 mb-6 px-2">
            <Clock className="w-6 h-6 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-800">Recent Conversions</h2>
          </div>
          
          <div className="bg-white/30 backdrop-blur-2xl border border-white/60 shadow-sm rounded-[2rem] overflow-hidden">
            {recentConversions.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-6 md:px-8 hover:bg-white/50 transition-colors cursor-pointer group ${
                  index !== recentConversions.length - 1 ? 'border-b border-white/40' : ''
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/70 rounded-xl flex items-center justify-center shadow-sm border border-white group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg text-slate-800 font-bold">{item.name}</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">{item.conversion}</p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-400 bg-white/40 px-4 py-2 rounded-full">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Basic Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}