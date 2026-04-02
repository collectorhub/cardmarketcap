"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Newsletter() {
  const [status, setStatus] = React.useState<'idle' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('success')
  }

  return (
    <section className="relative w-full py-16 overflow-hidden bg-emerald-950 dark:bg-emerald-950/40 border-y border-white/10">
      {/* Background Decorative Waves */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* Mobile Wave: Single deep curve (Visible only on small screens) */}
        <svg 
          className="block md:hidden w-full h-full" 
          viewBox="0 0 400 800" 
          preserveAspectRatio="none"
        >
          <path 
            fill="white" 
            d="M0,200 C100,150 300,250 400,200 L400,800 L0,800 Z" 
          />
        </svg>

        {/* Desktop Wave: Your existing multi-peak wave (Hidden on mobile) */}
        <svg 
          className="hidden md:block w-full h-full" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <path 
            fill="white" 
            d="M0,160L60,170.7C120,181,240,203,360,186.7C480,171,600,117,720,112C840,107,960,149,1080,154.7C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Tagline Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6">
            <Sparkles className="h-3 w-3 text-white" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
              Stay Ahead of the Market by Joining our Waitlist
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
            Weekly Intelligence <br className="hidden md:block" /> Delivered to Your Inbox
          </h2>
          
          {/* <p className="text-emerald-50/80 font-medium text-base md:text-lg mb-10 max-w-xl mx-auto">
            Join 10,000+ collectors receiving PSA 10 index updates and exclusive market alerts.
          </p> */}

          <div className="max-w-2xl mx-auto">
            {status === 'idle' ? (
              <form 
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch gap-3 bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl"
              >
                <input 
                  type="email" 
                  required
                  placeholder="Enter your best email address" 
                  className="flex-1 bg-slate-900 px-6 py-4 rounded-xl outline-none text-white placeholder:text-slate-400 font-bold shadow-inner"
                />
                <Button 
                  type="submit"
                  className="bg-[#008A66] hover:bg-[#007052] text-white px-10 py-4 rounded-xl font-black shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  Subscribe <Send className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white text-[#008A66] font-black flex flex-col items-center gap-2 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>YOU&apos;RE ON THE LIST!</span>
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                  Check your inbox for a confirmation link.
                </span>
              </motion.div>
            )}
          </div>

          {/* Social Proof Footer */}
          <div className="mt-8 flex items-center justify-center gap-4 text-white/60">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-[#00BA88] bg-slate-200" />
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Join the inner circle of collectors
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}