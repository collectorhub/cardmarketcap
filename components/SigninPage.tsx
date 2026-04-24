"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaApple, FaFacebook } from 'react-icons/fa' 
import { FcGoogle } from 'react-icons/fc' 
import { FaXTwitter } from 'react-icons/fa6'
import { Button } from "@/components/ui/button"
import Cookies from 'js-cookie' // 1. Import js-cookie

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://pokecollectorhub.com/api/signin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // 2. SET COOKIE (Crucial for Middleware to work)
        Cookies.set('user_token', result.token, { 
          expires: 7, // cookie expires in 7 days
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production' 
        });

        // 3. SET LOCALSTORAGE (For Client-side Navbar/Sidebar UI)
        localStorage.setItem('user_data', JSON.stringify(result.user));
        
        // 4. SYNC & REDIRECT
        window.dispatchEvent(new Event('storage'));
        
        // Since middleware will now kick in, we go to overview
        router.push('/overview');
        router.refresh(); // Forces Next.js to re-evaluate the session
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-[#0d1117] flex flex-col items-center px-4 font-sans selection:bg-[#00BA88]/30 transition-colors duration-300">
      
      <div className="flex-1 flex flex-col items-center justify-start w-full max-w-[400px] pt-8 md:pt-20">
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Link href="/">
            <div className="relative h-20 w-20 transition-transform hover:scale-105">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </div>
          </Link>
        </motion.div>

        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-10 tracking-tight text-center">
          Sign in to CardMarketCap
        </h1>

        <div className="w-full space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 text-[13px] bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-md font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-[14px] text-slate-700 dark:text-white block font-semibold">
                Username or email address
              </label>
              <input 
                type="text" 
                value={formData.identifier}
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                className="w-full h-11 bg-white dark:bg-[#0d1117] border border-slate-300 dark:border-[#30363d] rounded-md px-3 text-[14px] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#00BA88] focus:border-[#00BA88] outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[14px] text-slate-700 dark:text-white block font-semibold">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[12px] text-[#00BA88] hover:underline font-bold">
                  Forgot password?
                </Link>
              </div>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full h-11 bg-white dark:bg-[#0d1117] border border-slate-300 dark:border-[#30363d] rounded-md px-3 text-[14px] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#00BA88] focus:border-[#00BA88] outline-none transition-all"
                required
              />
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#00BA88] hover:bg-[#01aa7d] text-white font-bold rounded-md text-[14px] mt-2 shadow-none transition-all active:scale-[0.98] border border-[rgba(27,31,35,0.15)]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Social Auth Section */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-[#30363d]" />
              </div>
              <div className="relative flex justify-center text-[12px]">
                <span className="bg-white dark:bg-[#0d1117] px-3 text-slate-500 dark:text-[#8b949e]">or</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Continue with</p>
              
              <div className="flex justify-between items-center gap-3">
                <button className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                   <div className="w-full h-12 flex items-center justify-center border border-slate-200 dark:border-[#30363d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#161b22] transition-all">
                      <FcGoogle className="h-6 w-6" />
                   </div>
                   <span className="text-[11px] text-slate-500 font-medium">Google</span>
                </button>

                <button className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                   <div className="w-full h-12 flex items-center justify-center border border-slate-200 dark:border-[#30363d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#161b22] transition-all">
                      <FaApple className="h-6 w-6 dark:text-white" />
                   </div>
                   <span className="text-[11px] text-slate-500 font-medium">Apple</span>
                </button>

                <button className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                   <div className="w-full h-12 flex items-center justify-center border border-slate-200 dark:border-[#30363d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#161b22] transition-all">
                      <FaFacebook className="h-6 w-6 text-[#1877F2]" />
                   </div>
                   <span className="text-[11px] text-slate-500 font-medium">Facebook</span>
                </button>

                <button className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                   <div className="w-full h-12 flex items-center justify-center border border-slate-200 dark:border-[#30363d] rounded-lg hover:bg-slate-50 dark:hover:bg-[#161b22] transition-all">
                      <FaXTwitter className="h-5 w-5 dark:text-white" />
                   </div>
                   <span className="text-[11px] text-slate-500 font-medium">X</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-[10px] md:text-[14px] text-slate-600 dark:text-slate-300">
              New to CardMarketCap? <Link href="/sign-up" className="text-[#00BA88] hover:underline font-bold">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}