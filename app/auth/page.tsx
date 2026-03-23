/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, EyeOff, Eye, Sparkles, Loader2 } from 'lucide-react'; 
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

type AuthView = 'signin' | 'signup' | 'forgot' | 'otp' | 'reset';

export default function AuthPage() {
  const [view, setView] = useState<AuthView>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("rememberedUser");
    if (savedData) {
      const { email, password } = JSON.parse(savedData);
      setFormData((prev) => ({ ...prev, email, password }));
      setRememberMe(true);
    }
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95
    }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95
    })
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number, newView: AuthView) => {
    setPage([page + newDirection, newDirection]);
    setView(newView);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (res.ok) {
        toast.success("OTP sent to your email!");
        paginate(1, 'otp');
      } else {
        toast.error("User not found!");
      }
    } catch { 
      toast.error("Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      if (res.ok) {
        toast.success("OTP Verified!");
        paginate(1, 'reset');
      } else {
        toast.error("Invalid OTP code!");
      }
    } catch {
      toast.error("Verification error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, newPassword }),
      });
      if (res.ok) {
        toast.success("Password updated! Please login.");
        paginate(-1, 'signin');
      } else {
        toast.error("Failed to reset password.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Account created! Please sign in.");
        paginate(-1, 'signin');
      } else {
        const error = await res.json();
        toast.error(error.message || "Registration failed!");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (rememberMe) {
      localStorage.setItem("rememberedUser", JSON.stringify({
        email: formData.email,
        password: formData.password
      }));
    } else {
      localStorage.removeItem("rememberedUser");
    }

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials!");
      } else {
        toast.success("Welcome back!");
        router.push("/");
      }
    } catch {
      toast.error("An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const SocialButtons = () => (
    <div className="mt-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0a0a0c] px-2 text-zinc-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 transition-all group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm text-white font-medium">Google</span>
        </button>
        <button 
          type="button"
          onClick={() => signIn('apple', { callbackUrl: '/' })}
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 transition-all"
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 384 512">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-22.1-82.6-21.6-40.4.6-81.8 24.2-102.5 60.1-41.9 72.8-11 180.3 29.8 238.9 20 28.8 44.5 61.2 75.6 60 30-1.1 41.3-19.1 77.2-19.1 35.5 0 45.4 19.1 77.2 18.5 32.2-.6 53.6-29.4 73.4-58.2 23-33.4 32.4-65.7 32.7-67.4-.7-.3-63.7-24.5-63.9-96.9zM286.9 84.1c16.2-19.4 27.1-46.3 24.1-73.1-23.2 1-51.4 15.5-68.1 35.1-15 17.5-28.1 45-24.6 70.6 25.8 2 52.5-13.2 68.6-32.6z"/>
          </svg>
          <span className="text-sm text-white font-medium">Apple</span>
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className={`w-full bg-[#030303] grid place-items-center py-10 px-4 relative overflow-hidden font-sans transition-[min-height] duration-500 ease-in-out ${
        view === 'forgot' || view === 'otp' || view === 'reset' 
        ? 'min-h-screen' 
        : 'min-h-175 dvh' 
      }`}
    >
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[20px_20px] opacity-15"></div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 bg-[#D4F82E] rounded-full"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-107 z-10">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 via-purple-700 to-[#D4F82E] rounded-[2.5rem] blur-2xl opacity-30 animate-pulse"></div>

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={view}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="relative w-full bg-[#0a0a0c]/70 backdrop-blur-3xl border border-white/10 px-7 py-6 rounded-4xl shadow-2xl"
          >
            <div className="flex flex-col items-center mb-5 relative">
              <button 
                onClick={() => {
                  if (view === 'otp') paginate(-1, 'forgot');
                  else if (view === 'reset') paginate(-1, 'otp');
                  else view === 'signin' ? window.history.back() : paginate(-1, 'signin');
                }}
                className="absolute left-0 top-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-sky-500 hover:scale-110 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <button className="absolute right-0 top-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-sky-400">
                <Sparkles className="w-5 h-5" />
              </button>

              <motion.div
                className="mt-2 w-16 h-16 rounded-full bg-linear-to-b from-[#1a1a1c] to-[#050505] border border-white/10 flex items-center justify-center relative overflow-hidden group"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-[#D4F82E]/10 blur-xl"></div>
                <span className="font-bold text-2xl tracking-tight z-10">
                  <span className="text-blue-400">C</span><span className="text-gray-500">&</span><span className="text-green-400">D</span>
                </span>
              </motion.div>
            </div>

            {view === 'signin' && (
              <div className="flex flex-col w-full">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Welcome Back</h2>
                  <p className="text-zinc-400 text-xs px-2">Access your personalized ConvertHub dashboard.</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 text-xs font-bold pl-1">Email address</label>
                    <input 
                      type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="hello@example.com" 
                      className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4F82E]/40 transition-all" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-300 text-xs font-bold pl-1">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4F82E]/40 transition-all" 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <div 
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#D4F82E]/10 border-[#D4F82E]' : 'bg-[#121214] border-white/10'}`}
                      >
                        <Sparkles className={`w-2.5 h-2.5 text-[#D4F82E] transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                      <span className="text-zinc-300 text-xs group-hover:text-zinc-400 font-bold transition-colors">Remember me</span>
                    </label>
                    <button type="button" onClick={() => paginate(1, 'forgot')} className="text-zinc-300 text-xs font-bold hover:text-[#D4F82E]">Forgot Password?</button>
                  </div>

                  <button disabled={isLoading} className="w-full bg-[#D4F82E] hover:bg-[#c4e62a] text-black font-bold text-sm py-3.5 rounded-xl mt-2 transition-all flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowLeft className="w-4 h-4 rotate-180" /></>}
                  </button>
                </form>

                <SocialButtons />
                
                <p className="text-center text-zinc-400 text-xs mt-6">
                  New to ConvertHub? <button onClick={() => paginate(1, 'signup')} className="text-white font-semibold hover:text-[#D4F82E] transition-colors ml-2">Create Account</button>
                </p>
              </div>
            )}

            {view === 'forgot' && (
              <div className="flex flex-col w-full">
                <div className="text-center mb-6 mt-2">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Forgot Password?</h2>
                  <p className="text-zinc-400 text-xs px-2 leading-relaxed ">Enter your email and we&apos;ll send an OTP to reset your password instantly.</p>
                </div>

                <form className="space-y-6" onSubmit={handleForgotPassword}>
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 text-xs font-bold pl-2">Email address</label>
                    <input 
                      type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="hello@example.com" 
                      className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4F82E]/40 transition-all" 
                    />
                  </div>

                  <button disabled={isLoading} className="w-full bg-[#D4F82E] hover:bg-[#ee8012] text-black font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send OTP Code <Sparkles className="w-4 h-4" /></>}
                  </button>
                </form>
              </div>
            )}

            {view === 'otp' && (
              <div className="flex flex-col w-full">
                <div className="text-center mb-8 mt-2">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Verify OTP</h2>
                  <p className="text-zinc-400 text-xs px-2 leading-relaxed">Please enter the 6-digit code sent to your email.</p>
                </div>

                <form className="space-y-6" onSubmit={handleVerifyOTP}>
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-xs font-medium pl-1 text-center block">Enter Code</label>
                    <input 
                      type="text" required maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000" 
                      className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-4 text-center text-xl font-bold tracking-[1rem] text-[#D4F82E] focus:outline-none focus:border-[#D4F82E]/40 transition-all" 
                    />
                  </div>

                  <button disabled={isLoading} className="w-full bg-[#D4F82E] hover:bg-[#55ef08] text-black font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
                  </button>
                </form>
              </div>
            )}

            {view === 'reset' && (
              <div className="flex flex-col w-full">
                <div className="text-center mb-8 mt-2">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">New Password</h2>
                  <p className="text-zinc-400 text-xs px-2 leading-relaxed">Set a strong password for your ConvertHub account.</p>
                </div>

                <form className="space-y-6" onSubmit={handleResetPassword}>
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-xs font-medium pl-1">New Password</label>
                    <input 
                      type="password" required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#D4F82E]/40 transition-all" 
                    />
                  </div>

                  <button disabled={isLoading} className="w-full bg-[#D4F82E] hover:bg-[#c4e62a] text-black font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
                  </button>
                </form>
              </div>
            )}

            {view === 'signup' && (
              <div className="flex flex-col w-full">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Create Account</h2>
                  <p className="text-zinc-400 text-xs px-2">Join us to explore unlimited multi-format conversions.</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                  <input type="text" required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all" />
                  <input type="email" required placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all" />
                  <input type="password" required placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all" />

                  <button disabled={isLoading} className="w-full bg-[#D4F82E] hover:bg-[#c4e62a] text-black font-bold text-sm py-3.5 rounded-xl mt-4 transition-all flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <Sparkles className="w-4 h-4" /></>}
                  </button>
                </form>

                <SocialButtons />

                <p className="text-center text-zinc-400 text-xs mt-6">Already have an account? <button onClick={() => paginate(-1, 'signin')} className="text-white font-semibold ml-1">Sign In</button></p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}