"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ব্রাউজারে লোড হওয়ার পর আইকন দেখানোর জন্য
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />; // লেআউট শিফট রোধ করার জন্য

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
      aria-label="Toggle Theme"
    >
      {/* লাইট মোডে থাকলে Moon দেখাবে (যাতে ক্লিক করে ডার্ক করতে পারে), ডার্ক মোডে থাকলে Sun দেখাবে */}
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}