"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { FaGithub } from 'react-icons/fa' 
import { FcGoogle } from 'react-icons/fc' 
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  return (
    // REMOVED: overflow-hidden from the main wrapper
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row font-sans">
      
      {/* --- LEFT SIDE: BRAND/MARKETING SECTION --- 
          TWEAK: Added md:sticky top-0 md:h-screen to lock it in place on desktop
      */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full md:w-1/2 bg-[#040d21] p-10 md:p-20 flex flex-col justify-between min-h-[450px] md:h-screen md:sticky md:top-0 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image 
            src="/auth-bg.jpg" 
            alt="Market background"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
            priority
            onError={(e) => (e.currentTarget.style.display = 'none')} 
          />
          <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-[#00BA88]/10 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-20">
            <div className="relative h-10 w-10">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              CardMarket<span className="text-[#00BA88]">Cap</span>
            </span>
          </Link>

          <div className="max-w-lg">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-8">
              Create your <br /> 
              <span className="text-[#00BA88]">free account</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12 max-w-md">
              Explore CardMarketCap&apos;s core features for individuals and organizations.
            </p>
          </div>
        </div>

        {/* <div className="relative z-10 mt-auto pt-12">
           <motion.div 
             animate={{ y: [0, -12, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="w-32 h-32 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-[0_0_50px_-12px_rgba(0,186,136,0.3)]"
           >
              <div className="text-center">
                <div className="text-[#00BA88] font-black text-2xl tracking-tighter">LIVE</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Market Data</div>
              </div>
           </motion.div>
        </div> */}
      </motion.div>

      {/* --- RIGHT SIDE: SIGN UP FORM --- 
          TWEAK: This side remains relative and scrolls naturally as the form grows
      */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white dark:bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[440px] py-10"
        >
          <div className="mb-8 flex justify-between items-baseline border-b border-slate-100 dark:border-slate-800 pb-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Sign up to CardMarketCap</h2>
            <div className="text-[13px] text-slate-500">
              Already have an account? <Link href="/sign-in" className="text-[#00BA88] hover:underline font-bold">Sign in →</Link>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <Button variant="outline" className="w-full rounded-md font-semibold h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-[14px]">
              <FcGoogle className="mr-3 h-5 w-5" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full rounded-md font-semibold h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-[14px]">
              <FaGithub className="mr-3 h-5 w-5 dark:text-white" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
            <div className="relative flex justify-center text-[12px] font-medium text-slate-400">
              <span className="bg-white dark:bg-slate-950 px-4 italic">or</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 block">Email *</label>
              <input 
                type="email" 
                placeholder="Email"
                className="w-full h-11 bg-transparent dark:bg-slate-900 border border-[#d0d7de] dark:border-slate-700 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 block">Password *</label>
              <input 
                type="password" 
                placeholder="Password"
                className="w-full h-11 bg-transparent dark:bg-slate-900 border border-[#d0d7de] dark:border-slate-700 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                required
              />
              <p className="text-[12px] text-slate-500 leading-normal px-0.5">
                Password should be at least 15 characters OR at least 8 characters including a number and a lowercase letter.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 block">Username *</label>
              <input 
                type="text" 
                placeholder="Username"
                className="w-full h-11 bg-transparent dark:bg-slate-900 border border-[#d0d7de] dark:border-slate-700 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                required
              />
              <p className="text-[12px] text-slate-500 leading-normal px-0.5">
                Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 mb-3">Email preferences</h3>
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="marketing-emails"
                  className="mt-1 h-4 w-4 rounded border-[#d0d7de] text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="space-y-1">
                  <label htmlFor="marketing-emails" className="text-[13px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                    Receive occasional card updates and announcements
                  </label>
                </div>
              </div>
            </div>

            <Button className="w-full h-12 bg-[#00BA88] dark:bg-slate-100 dark:text-slate-900 hover:bg-[#048f6a] dark:hover:bg-white text-white font-bold rounded-md shadow-md mt-6 active:scale-[0.98] transition-all group text-[14px] cursor-pointer">
              Create account 
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">›</span>
            </Button>
          </form>

          <div className="mt-8">
            <p className="text-[12px] text-slate-500 leading-relaxed">
              By creating an account, you agree to the <Link href="#" className="text-[#00BA88] hover:underline font-bold">Terms of Service</Link>. 
              For more information about CardMarketCap&apos;s privacy practices, see the <Link href="#" className="text-[#00BA88] hover:underline font-bold">GitHub Privacy Statement</Link>. 
              We&apos;ll occasionally send you account-related emails.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}