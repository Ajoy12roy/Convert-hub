"use client"; // Required to detect the current page path

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Upload } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore'; // ✅ গ্লোবাল স্টোর ইমপোর্ট করা আছে

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // ✅ Auth State (গ্লোবাল স্টেট থেকে ডাটা আনা হয়েছে)
  const { isLoggedIn, user, setLogin } = useAuthStore();

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Area - ✅ RGB Moving Border Added Here */}
          <Link href="/" className="shrink-0 flex items-center cursor-pointer group">
            <div className="rgb-logo-wrapper shadow-sm hover:shadow-md transition-shadow">
              <div className="inner-logo-box bg-gray-50 flex items-center justify-center">
                <span className="font-bold text-xl tracking-tight z-10">
                  <span className="text-blue-500">C</span>
                  <span className="text-gray-400">&</span>
                  <span className="text-green-500">D</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex space-x-8">
            
            {/* ✅ লগইন করা থাকলেই শুধুমাত্র Home এবং বাকি লিংকগুলো দেখাবে */}
            {isLoggedIn && (
              <>
                <Link href="/" className={`text-sm font-semibold transition-colors ${
                    isActive('/') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
                  }`}>Home</Link>
                <Link href="/tools" className={`text-sm font-semibold transition-colors ${
                    isActive('/tools') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
                  }`}>Tools</Link>
                <Link href="/image" className={`text-sm font-semibold transition-colors ${
                    isActive('/image') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
                  }`}>Image</Link>
                <Link href="/video" className={`text-sm font-semibold transition-colors ${
                    isActive('/video') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
                  }`}>Video</Link>
                <Link href="/document" className={`text-sm font-semibold transition-colors ${
                    isActive('/document') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
                  }`}>Document</Link>
                <Link href="/code-converter" className={`text-sm font-semibold transition-colors ${
                    isActive('/code-converter') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
                  }`}>Code</Link>
                <Link href="/video-downloader" className={`text-sm font-semibold transition-colors ${
                    isActive('/video-downloader') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
                  }`}>Download</Link>
              </>
            )}
            
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => setLogin(true)} 
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setLogin(true)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-purple-500/20 active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Get Started</span>
                </button>
              </>
            ) : (
              /* ✅ Circle Shape Profile Icon */
              <Link href="/profile" className="cursor-pointer group ">
                <div className="w-11 h-11 rounded-full bg-white shadow-md border border-gray-200 overflow-hidden flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-emerald-700 font-extrabold text-lg">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}</span>
                  )}
                </div>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* ✅ CSS For C&D Logo RGB Border */}
      <style dangerouslySetInnerHTML={{__html: `
        .rgb-logo-wrapper {
          position: relative;
          width: 48px; /* Same as Tailwind w-12 */
          height: 48px; /* Same as Tailwind h-12 */
          border-radius: 12px; /* Same as Tailwind rounded-xl */
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 🌈 ঘুরতে থাকা RGB ব্যাকগ্রাউন্ড লোগোর জন্য */
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

        /* লোগোর ভেতরের সাদা বক্স */
        .inner-logo-box {
          position: relative;
          z-index: 1;
          width: 44px; /* Outer border 48px থেকে 4px কম, যেন বর্ডার দেখা যায় */
          height: 44px;
          background-color: #f9fafb; /* Tailwind bg-gray-50 */
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
  );
}