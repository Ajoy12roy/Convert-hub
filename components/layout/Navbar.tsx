"use client"; // Required to detect the current page path

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { Upload, Menu, X, ChevronRight } from 'lucide-react'; 
import { useAuthStore } from '@/store/useAuthStore';
import { ThemeToggle } from '@/components/ThemeToggle';

// ✅ ১. TypeScript 'any' এরর মুক্ত রাখার জন্য টাইপ ইন্টারফেস
interface AuthUser {
  profileImage?: string;
  fullName?: string;
}

interface AuthStoreShape {
  isLoggedIn: boolean;
  user: AuthUser | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter(); 
  const isActive = (path: string) => pathname === path;

  // ✅ ২. সব স্টেটগুলোকে সবার উপরে ডিক্লেয়ার করা হয়েছে (Hoisting Error Fix)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Zustand ডাটা স্টোর করার জন্য সেফ লোকাল স্টেট
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // ✅ ৩. সম্পূর্ণ নিরাপদ উপায়ে Zustand স্টোর সিঙ্ক এবং সাবস্ক্রিপশন (No Selector Type Error)
  useEffect(() => {
    // avoid synchronous setState inside effect to prevent cascading renders
    const t = setTimeout(() => {
      setMounted(true);
      
      // প্রথমবার পেজ লোড হওয়ার সময় স্টোর থেকে ডাটা রিড করা (Safe Cast)
      const initialState = useAuthStore.getState() as unknown as AuthStoreShape;
      if (initialState) {
        setIsLoggedIn(!!initialState.isLoggedIn);
        setUser(initialState.user || null);
      }
    }, 0);

    // রিয়েল-টাইমে Zustand স্টোরের ডাটা পরিবর্তনের লিসেনার
    const unsubscribe = useAuthStore.subscribe((state) => {
      const updatedState = state as unknown as AuthStoreShape;
      if (updatedState) {
        setIsLoggedIn(!!updatedState.isLoggedIn);
        setUser(updatedState.user || null);
      }
    });

    return () => {
      clearTimeout(t);
      unsubscribe(); // কম্পোনেন্ট আনমাউন্ট হলে লিসেনার বন্ধ হবে
    };
  }, []);

  // মেনু ওপেন থাকলে পেজের ব্যাকগ্রাউন্ড স্ক্রলিং বন্ধ করার জন্য
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // পেজ চেঞ্জ হলে মোবাইল মেনু স্বয়ংক্রিয়ভাবে বন্ধ করার জন্য
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const timeout = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname, isMobileMenuOpen]);

  return (
    <>
      <nav className="w-full border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Area */}
            <Link href="/" className="shrink-0 flex items-center cursor-pointer group">
              <div className="rgb-logo-wrapper shadow-sm hover:shadow-md transition-shadow">
                <div className="inner-logo-box bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
                  <span className="font-bold text-xl tracking-tight z-10">
                    <span className="text-blue-500">C</span>
                    <span className="text-gray-400">&</span>
                    <span className="text-green-500">D</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Center Navigation Links (Desktop Only) */}
            <div className="hidden md:flex space-x-8">
              {mounted && isLoggedIn && (
                <>
                  <Link href="/" className={`text-sm font-semibold transition-colors ${
                      isActive('/') ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}>Home</Link>
                  <Link href="/tools" className={`text-sm font-semibold transition-colors ${
                      isActive('/tools') ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}>Tools</Link>
                  <Link href="/image" className={`text-sm font-semibold transition-colors ${
                      isActive('/image') ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}>Image</Link>
                  <Link href="/video" className={`text-sm font-semibold transition-colors ${
                      isActive('/video') ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}>Video</Link>
                  <Link href="/document" className={`text-sm font-semibold transition-colors ${
                      isActive('/document') ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}>Document</Link>
                  <Link href="/code-converter" className={`text-sm font-semibold transition-colors ${
                      isActive('/code-converter') ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}>Code</Link>
                  <Link href="/video-downloader" className={`text-sm font-semibold transition-colors ${
                      isActive('/video-downloader') ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}>Download</Link>
                </>
              )}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-3 md:space-x-6">
              
              <ThemeToggle />

              {/* Conditional Buttons */}
              {mounted && (
                <>
                  {!isLoggedIn ? (
                    <>
                      <button 
                        onClick={() => router.push('/auth')} 
                        className="hidden md:block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => router.push('/auth')} 
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-purple-500/20 active:scale-95"
                      >
                        <Upload className="w-4 h-4 hidden sm:block" />
                        <span>Get Started</span>
                      </button>
                    </>
                  ) : (
                    <Link href="/profile" className="cursor-pointer group">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-emerald-700 dark:text-emerald-400 font-extrabold text-lg">
                        {user?.profileImage ? (
                          <Image 
                            src={user.profileImage} 
                            alt="Profile" 
                            width={44} 
                            height={44} 
                            className="w-full h-full object-cover"
                            unoptimized 
                          />
                        ) : (
                          <span>{user?.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}</span>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Hamburger Icon */}
                  {isLoggedIn && (
                    <button 
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none active:scale-95"
                    >
                      <Menu className="w-7 h-7" />
                    </button>
                  )}
                </>
              )}

            </div>
          </div>
        </div>

        {/* CSS For C&D Logo RGB Border */}
        <style dangerouslySetInnerHTML={{__html: `
          .rgb-logo-wrapper {
            position: relative;
            width: 48px;
            height: 48px;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .rgb-logo-wrapper::before {
            content: "";
            position: absolute;
            width: 150%;
            height: 150%;
            background: conic-gradient(
              #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000
            );
            animation: spin-rgb 3s linear infinite;
            z-index: 0;
          }

          .inner-logo-box {
            position: relative;
            z-index: 1;
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          @keyframes spin-rgb {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </nav>

      {/* Premium Glassmorphism Mobile Drawer (Sliding Menu) */}
      <div 
        className={`fixed inset-0 bg-slate-900/30 dark:bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* ✅ Tailwind v4 canonical fix: max-w-75 */}
      <div 
        className={`fixed top-0 right-0 h-full w-[75vw] max-w-75 bg-white/40 dark:bg-slate-900/50 backdrop-blur-2xl border-l border-white/40 dark:border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-700/30">
          <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">Menu</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 bg-white/40 dark:bg-slate-800/50 rounded-full hover:bg-white/60 dark:hover:bg-slate-700/60 shadow-sm backdrop-blur-md transition-all active:scale-90"
          >
            <X className="w-5 h-5 text-slate-800 dark:text-slate-200" />
          </button>
        </div>

        {/* ✅ Tailwind v4 canonical fix: bg-linear-to-r */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center justify-between w-full px-5 py-4 rounded-2xl border backdrop-blur-lg shadow-sm transition-all duration-300 ${isActive('/') ? 'bg-linear-to-r from-orange-500/90 to-pink-500/90 border-white/30 text-white shadow-orange-500/20 scale-105' : 'bg-white/40 dark:bg-slate-800/40 border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:shadow-md hover:-translate-y-1'}`}>
            <span className="font-bold text-sm tracking-wide">Home</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive('/') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1'}`} />
          </Link>
          <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center justify-between w-full px-5 py-4 rounded-2xl border backdrop-blur-lg shadow-sm transition-all duration-300 ${isActive('/tools') ? 'bg-linear-to-r from-orange-500/90 to-pink-500/90 border-white/30 text-white shadow-orange-500/20 scale-105' : 'bg-white/40 dark:bg-slate-800/40 border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:shadow-md hover:-translate-y-1'}`}>
            <span className="font-bold text-sm tracking-wide">Tools</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive('/tools') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1'}`} />
          </Link>
          <Link href="/image" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center justify-between w-full px-5 py-4 rounded-2xl border backdrop-blur-lg shadow-sm transition-all duration-300 ${isActive('/image') ? 'bg-linear-to-r from-orange-500/90 to-pink-500/90 border-white/30 text-white shadow-orange-500/20 scale-105' : 'bg-white/40 dark:bg-slate-800/40 border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:shadow-md hover:-translate-y-1'}`}>
            <span className="font-bold text-sm tracking-wide">Image</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive('/image') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1'}`} />
          </Link>
          <Link href="/video" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center justify-between w-full px-5 py-4 rounded-2xl border backdrop-blur-lg shadow-sm transition-all duration-300 ${isActive('/video') ? 'bg-linear-to-r from-orange-500/90 to-pink-500/90 border-white/30 text-white shadow-orange-500/20 scale-105' : 'bg-white/40 dark:bg-slate-800/40 border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:shadow-md hover:-translate-y-1'}`}>
            <span className="font-bold text-sm tracking-wide">Video</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive('/video') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1'}`} />
          </Link>
          <Link href="/document" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center justify-between w-full px-5 py-4 rounded-2xl border backdrop-blur-lg shadow-sm transition-all duration-300 ${isActive('/document') ? 'bg-linear-to-r from-orange-500/90 to-pink-500/90 border-white/30 text-white shadow-orange-500/20 scale-105' : 'bg-white/40 dark:bg-slate-800/40 border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:shadow-md hover:-translate-y-1'}`}>
            <span className="font-bold text-sm tracking-wide">Document</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive('/document') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1'}`} />
          </Link>
          <Link href="/code-converter" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center justify-between w-full px-5 py-4 rounded-2xl border backdrop-blur-lg shadow-sm transition-all duration-300 ${isActive('/code-converter') ? 'bg-linear-to-r from-orange-500/90 to-pink-500/90 border-white/30 text-white shadow-orange-500/20 scale-105' : 'bg-white/40 dark:bg-slate-800/40 border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:shadow-md hover:-translate-y-1'}`}>
            <span className="font-bold text-sm tracking-wide">Code Converter</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive('/code-converter') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1'}`} />
          </Link>
          <Link href="/video-downloader" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center justify-between w-full px-5 py-4 rounded-2xl border backdrop-blur-lg shadow-sm transition-all duration-300 ${isActive('/video-downloader') ? 'bg-linear-to-r from-orange-500/90 to-pink-500/90 border-white/30 text-white shadow-orange-500/20 scale-105' : 'bg-white/40 dark:bg-slate-800/40 border-white/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:shadow-md hover:-translate-y-1'}`}>
            <span className="font-bold text-sm tracking-wide">Download</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive('/video-downloader') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1'}`} />
          </Link>
        </div>
        
        <div className="p-6 text-center border-t border-white/20 dark:border-slate-700/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Converthub v2.0</p>
        </div>
      </div>
    </>
  );
}