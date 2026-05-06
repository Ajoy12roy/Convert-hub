"use client";
import { Gift, ArrowRight, Upload, Settings, Download, Zap, ShieldCheck, Layers } from 'lucide-react';
import InfiniteScroller from '@/components/ui/InfiniteScroller';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const row1 = [
    { from: 'PDF', to: 'Word' }, { from: 'JPG', to: 'PNG' }, { from: 'Word', to: 'PDF' },
    { from: 'PNG', to: 'JPG' }, { from: 'PDF', to: 'JPG' }, { from: 'DOCX', to: 'PDF' },
    { from: 'HEIC', to: 'JPG' }, { from: 'WEBP', to: 'PNG' }
  ];

  const row2 = [
    { from: 'DEG', to: 'KEL' }, { from: 'CEL', to: 'FAR' }, { from: 'KG', to: 'LBS' },
    { from: 'MILE', to: 'KM' }, { from: 'MTR', to: 'FEET' }, { from: 'BAR', to: 'PSI' },
    { from: 'WATT', to: 'HP' }, { from: 'LIT', to: 'GAL' }
  ];

  const row3 = [
    { from: 'MP4', to: 'MP3' }, { from: 'JS', to: 'TS' }, { from: 'MP3', to: 'WAV' },
    { from: 'CSS', to: 'SCSS' }, { from: 'MOV', to: 'MP4' }, { from: 'JSON', to: 'YAML' },
    { from: 'HTML', to: 'JSX' }, { from: 'MD', to: 'HTML' }
  ];

  return (
    // ✅ ডার্ক মোডের জন্য dark:bg-slate-950 এবং dark:text-white যোগ করা হয়েছে
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 px-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-fuchsia-50/50 via-white to-white dark:from-purple-900/10 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-4 py-1.5 rounded-full mb-12 shadow-sm">
            <Gift className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium tracking-tight">Free to use · No limits on small files</span>
          </div>
         <h1 className="text-[5rem] leading-[1.1] font-extrabold tracking-tight mb-8">
          <span className="text-[#0F172A] dark:text-white">Convert </span>
          
<motion.span
  className="inline-block pr-3"
  animate={{
    x: [-12, -12, 10, 10, -12],
    color: ["#000000", "#000000", "#9333EA", "#9333EA", "#000000"],
    textShadow: [
      "0px 0px 6px rgba(0,0,0,0.7)",
      "0px 0px 6px rgba(0,0,0,0.7)",
      "0px 0px 12px rgba(147,51,234,0.9)",
      "0px 0px 12px rgba(147,51,234,0.9)",
      "0px 0px 6px rgba(0,0,0,0.7)",
    ],
  }}
  transition={{ duration: 5, times: [0, 0.2, 0.4, 0.7, 1], ease: "easeInOut", repeat: Infinity }}
>
  ⇄
</motion.span>

          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-purple-500 to-purple-400">
            Anything
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-600 via-pink-500 to-pink-400">
            Anywhere
          </span>
        </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The premium multi-tool converter for documents, images, video, and code.
          </p>
           
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/auth">
            <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full text-lg font-bold transition-all shadow-lg group">
              <span>Start Converting</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
            <button className="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white px-10 py-4 rounded-full text-lg font-bold transition-all">Try Code Converter</button>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CONVERSIONS */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto text-center px-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Popular Conversions</h2>
          <p className="text-slate-500 dark:text-slate-400">Quick access to our most used conversion tools</p>
        </div>
        <div className="flex flex-col gap-4">
          <InfiniteScroller items={row1} speed={40} direction="left-to-right" />
          <InfiniteScroller items={row2} speed={50} direction="right-to-left" />
          <InfiniteScroller items={row3} speed={45} direction="left-to-right" />
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-16">Convert your files in three simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard icon={<Upload className="w-10 h-10 text-purple-600" />} title="1. Upload File" desc="Select the file you want to convert from your device." bg="bg-purple-50 dark:bg-purple-900/20" border="border-purple-100 dark:border-purple-900/30" />
            <StepCard icon={<Settings className="w-10 h-10 text-blue-600" />} title="2. Choose Format" desc="Pick your output format and let ConvertHub work its magic." bg="bg-blue-50 dark:bg-blue-900/20" border="border-blue-100 dark:border-blue-900/30" />
            <StepCard icon={<Download className="w-10 h-10 text-green-600" />} title="3. Download" desc="Your file is ready! Download it instantly to your device." bg="bg-green-50 dark:bg-green-900/20" border="border-green-100 dark:border-green-900/30" />
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE CONVERTHUB? */}
      <section className="py-24 px-4 bg-slate-50/30 dark:bg-slate-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Why Choose ConvertHub?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-16">The best file conversion platform with powerful features</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<Zap className="w-6 h-6 text-green-600" />} title="Fast Conversion" desc="Lightning-fast conversion speed for all file types" iconBg="bg-green-100 dark:bg-green-900/30" />
            <FeatureCard icon={<ShieldCheck className="w-6 h-6 text-blue-600" />} title="Secure Files" desc="Your files are encrypted and automatically deleted" iconBg="bg-blue-100 dark:bg-blue-900/30" />
            <FeatureCard icon={<Layers className="w-6 h-6 text-purple-600" />} title="Multiple Formats" desc="Support for hundreds of file formats" iconBg="bg-purple-100 dark:bg-purple-900/30" />
            <FeatureCard icon={<Gift className="w-6 h-6 text-pink-600" />} title="Free Tools" desc="All conversion tools are completely free" iconBg="bg-pink-100 dark:bg-pink-900/30" />
          </div>
        </div>
      </section>

      {/* 5. READY TO CONVERT CTA */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-indigo-200 dark:shadow-none">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Convert Your Files?</h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">Join thousands of users who trust ConvertHub for their file conversion needs</p>
          <Link href="/auth">
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all flex items-center mx-auto space-x-2 group">
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StepCard({ icon, title, desc, bg, border }: any) {
  return (
    <div className="flex flex-col items-center group">
      <div className={`w-20 h-20 ${bg} rounded-3xl flex items-center justify-center mb-6 border ${border} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-62.5">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc, iconBg }: any) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-50 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}