"use client"; // Required to detect the current page path

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Upload } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // ✅ Auth State (লগইন কন্ট্রোল করার জন্য ডেমো স্টেট)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // শুরুতে false থাকবে
  const [user] = useState({
    fullName: "Alex Morrison",
    profileImage: null // ছবি থাকলে এখানে লিংক দিন, না থাকলে প্রথম অক্ষর দেখাবে
  });

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Area */}
          <Link href="/" className="shrink-0 flex items-center cursor-pointer">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="font-bold text-xl tracking-tight">
                <span className="text-blue-500">C</span>
                <span className="text-gray-400">&</span>
                <span className="text-green-500">D</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex space-x-8">
            
            <Link href="/" className={`text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
              }`}>Home</Link>
            
            {/* ✅ লগইন করা থাকলেই শুধুমাত্র বাকি লিংকগুলো দেখাবে */}
            {isLoggedIn && (
              <>
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
                  onClick={() => setIsLoggedIn(true)} 
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-purple-500/20 active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Get Started</span>
                </button>
              </>
            ) : (
              /* ✅ স্কয়ার শেপ প্রোফাইল আইকন সাথে RGB বর্ডার এনিমেশন */
              <Link href="/profile" className="cursor-pointer group">
                <div className="rgb-square-wrapper shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                  <div className="inner-profile-square text-emerald-700 font-extrabold text-lg">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}</span>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* ✅ RGB স্কয়ার বর্ডারের জন্য কাস্টম CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .rgb-square-wrapper {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 12px; /* Square with rounded corners */
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 🌈 ঘুরতে থাকা RGB ব্যাকগ্রাউন্ড */
        .rgb-square-wrapper::before {
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

        /* ভেতরের সাদা স্কয়ার বক্স */
        .inner-profile-square {
          position: relative;
          z-index: 1;
          width: 40px; /* Outer 46px - inner 40px = 3px border on each side */
          height: 40px;
          background-color: white;
          border-radius: 9px;
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