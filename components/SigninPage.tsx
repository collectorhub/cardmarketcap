"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaGithub, FaApple } from 'react-icons/fa' 
import { FcGoogle } from 'react-icons/fc' 
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  return (
    <div className="h-screen bg-white dark:bg-[#0d1117] flex flex-col items-center px-4 font-sans selection:bg-[#00BA88]/30 transition-colors duration-300 overflow-hidden">
      
      {/* Centered Content Wrapper */}
      <div className="flex-1 flex flex-col items-center justify-start w-full max-w-[400px] pt-8 md:pt-20">
        
        {/* 1. Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-"
        >
          <Link href="/">
            <div className="relative h-23 w-23 transition-transform hover:scale-105">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </div>
          </Link>
        </motion.div>

        {/* 2. Bold Page Title */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight text-center">
          Sign in to CardMarketCap
        </h1>

        {/* 3. Input Section (No Container) */}
        <div className="w-full space-y-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-[14px] text-slate-700 dark:text-white block font-semibold">
                Username or email address
              </label>
              <input 
                type="text" 
                className="w-full h-10 bg-white dark:bg-[#0d1117] border border-slate-300 dark:border-[#30363d] rounded-md px-3 text-[14px] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#00BA88] focus:border-[#00BA88] outline-none transition-all"
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
                className="w-full h-11 bg-white dark:bg-[#0d1117] border border-slate-300 dark:border-[#30363d] rounded-md px-3 text-[14px] text-slate-900 dark:text-white focus:ring-1 focus:ring-[#00BA88] focus:border-[#00BA88] outline-none transition-all"
                required
              />
            </div>

            <Button className="w-full h-11 bg-[#00BA88] hover:bg-[#01aa7d] text-white font-bold rounded-md text-[14px] mt-2 shadow-none transition-all active:scale-[0.98] border border-[rgba(27,31,35,0.15)]">
              Sign in
            </Button>
          </form>

          {/* 4. Social Auth Section */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-[#30363d]" />
              </div>
              <div className="relative flex justify-center text-[12px]">
                <span className="bg-white dark:bg-[#0d1117] px-3 text-slate-500 dark:text-[#8b949e]">or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full h-11 border-slate-200 dark:border-[#30363d] dark:bg-transparent dark:text-[#c9d1d9] hover:bg-slate-50 dark:hover:bg-[#161b22] rounded-md transition-all font-semibold flex justify-center items-center gap-2 shadow-none">
                <FcGoogle className="h-4 w-4" />
                Continue with Google
              </Button>
              {/* <Button variant="outline" className="w-full h-11 border-slate-200 dark:border-[#30363d] dark:bg-transparent dark:text-[#c9d1d9] hover:bg-slate-50 dark:hover:bg-[#161b22] rounded-md transition-all font-semibold flex justify-center items-center gap-2 shadow-none">
                <FaGithub className="h-4 w-4" />
                Continue with GitHub
              </Button> */}
              <Button variant="outline" className="w-full h-11 border-slate-200 dark:border-[#30363d] dark:bg-transparent dark:text-[#c9d1d9] hover:bg-slate-50 dark:hover:bg-[#161b22] rounded-md transition-all font-semibold flex justify-center items-center gap-2 shadow-none">
                <FaApple className="h-4 w-4" />
                Continue with Apple
              </Button>
            </div>
          </div>

          {/* 5. Create Account Prompt */}
          <div className="text-center pt-2">
            <p className="text-[14px] text-slate-600 dark:text-slate-300">
              New to CardMarketCap? <Link href="/sign-up" className="text-[#00BA88] hover:underline font-bold">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}