"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function ForgotPassword() {
  return (
    <div className="h-screen bg-white dark:bg-[#0d1117] flex flex-col items-center px-4 font-sans selection:bg-[#00BA88]/30 transition-colors duration-300 overflow-hidden">
      
      {/* Centered Content Wrapper */}
      <div className="flex-1 flex flex-col items-center justify-start pt-20 w-full max-w-[400px]">
        
        {/* 1. Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className=""
        >
          <Link href="/">
            <div className="relative h-23 w-23 transition-transform hover:scale-105">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </div>
          </Link>
        </motion.div>

        {/* 2. Bold Page Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reset your password
          </h1>
          <p className="text-[14px] text-slate-600 dark:text-[#8b949e] mt-2 leading-relaxed">
            Enter your email address and we will send you a password reset link.
          </p>
        </div>

        {/* 3. Reset Form (No Container) */}
        <div className="w-full">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-[14px] text-slate-700 dark:text-white block font-semibold">
                Email address
              </label>
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="w-full h-11 bg-white dark:bg-[#0d1117] border border-slate-300 dark:border-[#30363d] rounded-md px-3 text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#484f58] focus:ring-1 focus:ring-[#00BA88] focus:border-[#00BA88] outline-none transition-all"
                required
              />
            </div>

            <Button className="w-full h-11 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded-md text-[14px] mt-2 shadow-none transition-all active:scale-[0.98] border border-[rgba(27,31,35,0.15)]">
              Send password reset email
            </Button>
          </form>

          {/* 4. Back to Sign In */}
          <div className="text-center mt-6">
            <Link 
              href="/sign-in" 
              className="text-[14px] text-[#00BA88] hover:underline font-semibold flex items-center justify-center gap-1"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Simple Footer */}
      <footer className="w-full py-6 flex justify-center gap-x-6 text-[12px] text-slate-500 dark:text-[#8b949e] border-t border-slate-100 dark:border-[#1b1f23]">
        <Link href="#" className="hover:text-[#00BA88] transition-colors">Terms</Link>
        <Link href="#" className="hover:text-[#00BA88] transition-colors">Privacy</Link>
        <Link href="#" className="hover:text-[#00BA88] transition-colors">Contact Support</Link>
      </footer>
    </div>
  )
}