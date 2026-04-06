"use client"

import Link from 'next/link'
import Image from 'next/image'
import { FaTwitter, FaInstagram, FaGithub, FaDiscord } from 'react-icons/fa'
import { cn } from "@/lib/utils"

const footerSections = [
  {
    title: "Socials",
    links: [
      { name: "X (Twitter)", href: "#", icon: FaTwitter },
      { name: "Instagram", href: "#", icon: FaInstagram },
      { name: "Discord", href: "#", icon: FaDiscord },
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Contact us", href: "/contact" },
      { name: "Request form", href: "/request" },
      { name: "API Documentation", href: "/api-docs" },
      { name: "Help Center", href: "/help" },
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About us", href: "/about" },
      { name: "Terms of use", href: "/terms" },
      { name: "Disclaimer", href: "/disclaimer" },
      { name: "Privacy Policy", href: "/privacy" },
    ]
  },
  {
    title: "Products",
    links: [
      { name: "Card Sets", href: "/sets" },
      { name: "Portfolio", href: "/portfolio" },
      { name: "Watchlist", href: "/watchlist" },
      { name: "Advertise", href: "/advertise" },
      { name: "Indicators", href: "/indicators" },
      { name: "Indices", href: "/indices" },
    ]
  }
]

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-[#F9FAFB] dark:bg-[#020617] transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-12 md:py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-12 mb-16">
          
          {/* Brand Column - Spans 2 columns on large screens */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-7 w-7">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  fill 
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                CardMarket<span className="text-[#00BA88]">Cap</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs font-medium">
              Track graded Pokémon cards, follow market moves, and discover new opportunities in your collection.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                Live Market Data
              </span>
            </div>
          </div>

          {/* Dynamic Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-5">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center gap-2 text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[#00BA88] dark:hover:text-[#00BA88] transition-colors"
                    >
                      {link.icon && <link.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#00BA88]" />}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[12px] font-medium text-slate-400 dark:text-slate-600">
            © {currentYear} CardMarketCap. All rights reserved. Data provided for entertainment purposes.
          </p>
          
          <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">
            <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-6 ml-2 hidden md:flex">
                <span className="text-slate-300 dark:text-slate-800 italic font-medium normal-case">Systems Nominal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}