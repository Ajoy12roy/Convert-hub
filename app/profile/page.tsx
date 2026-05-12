"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Settings, 
  Activity, 
  Clock,
  X,
  User,
  Mail,
  LogOut,
  Trash2 
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore'; 
import { useRouter } from 'next/navigation'; 

// ✅ Typewriter Effect Hook
const useTypewriter = (text: string, speed: number = 60) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) return;
    
    let i = 0;
    setDisplayedText(''); 

    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayedText;
};

export default function ProfilePage() {
  // ✅ removeFromHistory কল করার জন্য সঠিক মেথড ব্যবহার করা হয়েছে
  const { user, updateProfileImage, removeProfileImage, logout, history, removeFromHistory } = useAuthStore() as any;
  const router = useRouter(); 

  const [daysStayed] = useState(0); 
  const isEligible = daysStayed >= 60;
  
  const [showNote, setShowNote] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'User',
    email: user?.email || 'user@email.com',
    username: user?.username || '@user',
    role: isEligible ? 'Premium User' : 'Non-Premium User'
  });

  const typedFullName = useTypewriter(profileData.fullName, 80);
  const typedEmail = useTypewriter(profileData.email, 60);
  const typedUsername = useTypewriter(profileData.username, 80);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfileImage(base64String); 
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleDeleteItem = (id: string) => {
    if (removeFromHistory) {
      removeFromHistory(id);
    }
  };

  const quickTools = [
    { title: "Image Converter", desc: "Convert images to different formats", icon: <ImageIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />, path: "/image" },
    { title: "Resize & Optimize", desc: "Adjust dimensions and quality", icon: <Settings className="w-6 h-6 text-teal-600 dark:text-teal-400" />, path: "/video" },
    { title: "Batch Processing", desc: "Convert multiple files at once", icon: <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />, path: "/document" }
  ];

  return (
    <div className="min-h-screen bg-[#f4fcf6] dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-24 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-200 h-200 bg-emerald-200/40 dark:bg-emerald-900/20 blur-[140px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3 z-0 transition-colors"></div>
      <div className="absolute top-[40%] right-0 w-200 h-200 bg-teal-200/30 dark:bg-teal-900/20 blur-[120px] rounded-full pointer-events-none translate-x-1/4 z-0 transition-colors"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 relative z-10">
        
        <div className="mb-14 text-center animate-fade-in-down">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="relative bg-white/30 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-slate-800 shadow-[0_12px_40px_rgba(16,185,129,0.08)] dark:shadow-none rounded-[2.5rem] p-10 md:p-14 mb-16 flex flex-col md:flex-row items-center md:items-start gap-14 animate-fade-in-up transition-all hover:bg-white/40 dark:hover:bg-slate-900/60 group/card">
          
          <button 
            onClick={() => { setFormData(profileData); setIsEditing(true); }}
            className="absolute top-6 right-6 p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/70 dark:border-slate-700 shadow-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:scale-110 transition-all duration-500 group z-20"
          >
            <Settings className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:rotate-180 transition-all duration-700" />
          </button>

          <div className="shrink-0 flex flex-col items-center gap-6">
            <div 
              className="relative w-48 h-48 bg-white dark:bg-slate-800 rounded-full p-1 shadow-2xl border-2 border-emerald-100 dark:border-slate-700 group cursor-pointer overflow-hidden transition-colors"
              onClick={user?.profileImage ? removeProfileImage : triggerImageUpload}
            >
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-900 relative transition-colors">
                {user?.profileImage ? (
                  <>
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-rose-600/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                      <Trash2 className="w-10 h-10 mb-1 animate-bounce" />
                      <span className="text-xs font-black uppercase tracking-tighter">Remove</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-6xl font-black text-emerald-600 dark:text-emerald-400 group-hover:opacity-20 transition-opacity">
                      {profileData.fullName.charAt(0)}
                    </span>
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300">
                      <div className="group-hover:hidden flex flex-col items-center animate-in fade-in duration-500">
                        <Camera className="w-10 h-10 text-emerald-600/40 dark:text-emerald-400/40" />
                      </div>
                      <div className="hidden group-hover:flex flex-col items-center animate-in zoom-in-75 duration-300">
                        <Upload className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase mt-1">Upload</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>

            <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-500 hover:text-white border border-rose-100 dark:border-rose-900/50 text-rose-500 dark:text-rose-400 rounded-2xl font-black transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-sm uppercase text-[10px] tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
          </div>

          <div className="grow w-full">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 border-b border-white/50 dark:border-slate-800 pb-4 tracking-tight transition-colors">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="w-full px-6 py-4 bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/70 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-200 font-bold shadow-sm flex items-center transition-colors">
                  <span className="border-r-2 border-emerald-500/50 pr-1 min-h-6">{typedFullName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="w-full px-6 py-4 bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/70 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-200 font-bold shadow-sm flex items-center transition-colors">
                  <span className="border-r-2 border-emerald-500/50 pr-1 min-h-6">{typedEmail}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Username</label>
                <div className="w-full px-6 py-4 bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/70 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-200 font-bold shadow-sm flex items-center transition-colors">
                  <span className="border-r-2 border-emerald-500/50 pr-1 min-h-6">{typedUsername}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Account Status</label>
                <button 
                  onClick={() => setShowNote(!showNote)}
                  className={`w-full px-6 py-4 rounded-2xl font-black shadow-lg flex items-center justify-between uppercase text-xs tracking-widest min-h-14 transition-all duration-300 active:scale-95 ${
                    isEligible ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-800 dark:bg-slate-700 text-white shadow-slate-800/20 dark:shadow-none'
                  }`}
                >
                  {profileData.role}
                  <div className={`w-2.5 h-2.5 rounded-full animate-ping ${
                    isEligible ? 'bg-white shadow-[0_0_8px_#a7f3d0]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  }`}></div>
                </button>
                {showNote && (
                  <div className="mt-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/80 backdrop-blur-md border border-white/80 dark:border-slate-700 shadow-sm animate-in slide-in-from-top-2 fade-in duration-300">
                    <p className={`text-[10px] font-bold tracking-widest uppercase leading-relaxed text-center ${isEligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-500 dark:text-orange-400'}`}>
                      If you stay with our website for at least 2 months, you will be eligible for a premium user account
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 px-2 tracking-tight transition-colors">Quick Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickTools.map((tool, index) => (
              <div key={index} onClick={() => router.push(tool.path)} className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-slate-800 shadow-sm hover:shadow-xl rounded-4xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-white/70 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-white dark:border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 transition-colors">{tool.title}</h3>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium transition-colors">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Updated Recent History Section */}
        <div>
          <div className="flex items-center gap-3 mb-6 px-2">
            <Clock className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors">Recent History</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {history && history.length > 0 ? (
              history.slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700 rounded-2xl transition-all hover:bg-white/60 dark:hover:bg-slate-800/60 group animate-in slide-in-from-bottom-2 fade-in duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm transition-colors">
                      <Clock className="w-5 h-5 text-slate-400 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 transition-colors">{item.pageName}</p>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.conversionType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{item.timestamp}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-3 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all active:scale-90"
                      title="Delete History"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white/20 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700">
                   <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-slate-400 dark:text-slate-500 font-bold tracking-tight">No history found yet. Try converting a file!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-white dark:border-slate-800 shadow-[0_32px_80px_rgba(0,0,0,0.3)] dark:shadow-2xl rounded-[3rem] p-10 w-full max-w-lg relative animate-in zoom-in-95 duration-500 transition-colors">
            <button onClick={() => setIsEditing(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all hover:rotate-90"><X className="w-6 h-6 text-slate-400 dark:text-slate-500" /></button>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter uppercase transition-colors">Edit Profile</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-slate-800 dark:text-white font-bold outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-slate-800 dark:text-white font-bold outline-none transition-all" />
                </div>
              </div>
            </div>
            <div className="mt-10 flex gap-4">
              <button onClick={() => setIsEditing(false)} className="w-1/2 py-4 rounded-2xl font-bold text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">Cancel</button>
              <button onClick={handleSaveProfile} className="w-1/2 py-4 rounded-2xl font-black text-white bg-emerald-600 shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all">Save Profile</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { 0% { opacity: 0; transform: translateY(-30px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}