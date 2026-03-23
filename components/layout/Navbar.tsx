"use client"; // Required to detect the current page path

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Upload } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

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
            <Link href="/tools" className={`text-sm font-semibold transition-colors ${
                isActive('/tools') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
              }`}>Tools</Link>
            <Link href="/image" className={`text-sm font-semibold transition-colors ${
                isActive('/image') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
              }`}>Image</Link>
            <Link href="/video" className={`text-sm font-semibold transition-colors ${
                isActive('/video') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
              }`}>Video</Link>
            <Link href="/tools" className={`text-sm font-semibold transition-colors ${
                isActive('/tools') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
              }`}>Document</Link>
            <Link href="/tools" className={`text-sm font-semibold transition-colors ${
                isActive('/tools') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
              }`}>Code</Link>
            <Link href="/tools" className={`text-sm font-semibold transition-colors ${
                isActive('/tools') ? 'text-orange-500' : 'text-gray-600 hover:text-gray-900'
              }`}>Download</Link>
            
          </div>

          {/* Right Action Buttons */}
          {/* Right Action Buttons */}
          <div className="flex items-center space-x-6">
            <Link href="/auth" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
              Sign In
            </Link>
            <Link href="/auth">
              <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-purple-500/20 active:scale-95">
                <Upload className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}