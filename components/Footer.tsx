"use client"

import Link from 'next/link'
import Image from 'next/image'
import { FaTwitter, FaGithub, FaGlobe } from 'react-icons/fa' // Importing from FontAwesome set

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-6 w-6">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  fill 
                  className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-sm font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                CardMarket<span className="text-[#00BA88]">Cap</span>
              </span>
            </Link>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500 tracking-wide">
              © {currentYear} CardMarketCap. Data provided for entertainment purposes.
            </p>
          </div>

          {/* Center: Quick Links */}
          <nav className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">
            <Link href="/terms" className="hover:text-[#00BA88] transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-[#00BA88] transition-colors">Privacy</Link>
            <Link href="/api-docs" className="hover:text-[#00BA88] transition-colors">API</Link>
            <Link href="/contact" className="hover:text-[#00BA88] transition-colors">Contact</Link>
          </nav>

          {/* Right: Social/Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00BA88] animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Systems Nominal
              </span>
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
              <Link href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <FaTwitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <FaGithub className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <FaGlobe className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}