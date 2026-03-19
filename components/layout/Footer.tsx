import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-400 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6">
              <span className="font-bold text-xl tracking-tight">
                <span className="text-blue-500">C</span>
                <span className="text-gray-400">&</span>
                <span className="text-green-500">D</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Convert any file format instantly with our secure online platform.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-bold mb-6">Tools</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Video Converter</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Audio Converter</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Image Converter</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Document Converter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Popular Converters</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">MP4 to MP3</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">PDF to Word</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">JPG to PNG</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Word to PDF</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">API</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Get API Key</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs">
          © 2026 C&D. All rights reserved.
        </div>
      </div>
    </footer>
  );
}