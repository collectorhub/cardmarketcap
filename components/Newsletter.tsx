"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { addSubscriber } from '@/lib/queries/subscribers'

export function Newsletter() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'exists'>('idle')
  const [email, setEmail] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const response = await addSubscriber(email)
      
      if (response.message?.toLowerCase().includes('exists')) {
        setStatus('exists')
      } else if (response.success) {
        setStatus('success')
      } else {
        setStatus('idle')
      }

      setTimeout(() => {
        setStatus('idle')
        if (response.success) setEmail('')
      }, 5000)

    } catch (error) {
      console.error("Newsletter submission failed:", error)
      setStatus('idle')
    }
  }

  return (
    /* REDUCED MIN-HEIGHT AND CHANGED items-start TO items-center */
    <section className="relative w-full min-h-[350px] md:min-h-[500px] flex items-start overflow-hidden bg-emerald-950">
      
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/banner_1.jpg" 
          alt="Branding Banner"
          fill
          className="object-cover object-center" /* CHANGED object-bottom TO center FOR SMALLER AREA */
          priority
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70" /> */}
      </div>

      {/* TIGHTENED PADDING: Changed pt-20 pb-52 to py-12 (Mobile) and py-16 (Desktop) */}
      <div className="max-w-4xl mx-auto relative z-10 px-6 py-8 md:py-12 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl md:text-4xl font-black text-white tracking-tighter mb-2 drop-shadow-xl">
            Subscribe to Our Newsletter
          </h2>

          <div className="max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              {status === 'idle' || status === 'loading' ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onSubmit={handleSubmit}
                  className="flex flex-row items-center gap-2 bg-white/10 dark:bg-black/30 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/20 shadow-2xl"
                >
                  <input 
                    type="email" 
                    required
                    disabled={status === 'loading'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address" 
                    className="flex-1 min-w-0 bg-white/95 px-4 py-2.5 md:py-3 rounded-xl outline-none text-slate-900 dark:text-white placeholder:text-slate-500 font-bold transition-all focus:ring-2 focus:ring-[#00BA88]/50 disabled:opacity-70 text-sm md:text-base"
                  />
                  <Button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="shrink-0 bg-[#00BA88] hover:bg-[#00d199] text-white px-4 md:px-8 py-2.5 md:py-3 rounded-xl font-black shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 h-auto"
                  >
                    <span className="hidden md:inline">
                      {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </span>
                    {status === 'loading' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-2xl border border-white/20 font-black flex flex-col items-center gap-1 shadow-2xl"
                >
                  <div className={`flex items-center gap-3 ${status === 'exists' ? 'text-amber-600' : 'text-[#008A66] dark:text-[#00BA88]'}`}>
                    {status === 'exists' ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                    <span className="text-lg tracking-tight uppercase">
                      {status === 'exists' ? "Already Subscribed!" : "You're on the list!"}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">
                    {status === 'exists' 
                      ? "This email is already receiving our intelligence reports." 
                      : "Check your inbox for a confirmation link."}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}