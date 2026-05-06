import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // Ensure folder name is 'components'
import { ThemeProvider } from "@/components/ThemeProvider"; // ✅ ThemeProvider ইমপোর্ট করা হয়েছে

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConvertHub | Premium Multi-Tool",
  description: "Convert anything, anywhere.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ suppressHydrationWarning যুক্ত করা হয়েছে যাতে ডার্ক মোডের জন্য কোনো এরর না আসে
    <html lang="en" suppressHydrationWarning> 
      {/* ✅ dark:bg-slate-950 এবং dark:text-white যুক্ত করা হয়েছে যেন ডার্ক মোডে ব্যাকগ্রাউন্ড কালো হয় */}
      <body className={`${geistSans.variable} antialiased bg-white dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300`}>
        
        {/* ✅ ThemeProvider দিয়ে পুরো অ্যাপটি র‍্যাপ করা হয়েছে */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // ডিফল্ট মোড লাইট রাখা হয়েছে
          enableSystem={false}
        >
          {/* Navbar is placed HERE so it stays on every page */}
          <Navbar />
          
          {/* Everything inside page.tsx (Home) or other pages goes here */}
          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}