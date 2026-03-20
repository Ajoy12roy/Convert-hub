import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // Ensure folder name is 'components'

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
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-white`}>
        {/* Navbar is placed HERE so it stays on every page */}
        <Navbar />
        
        {/* Everything inside page.tsx (Home) or other pages goes here */}
        {children}
      </body>
    </html>
  );
}