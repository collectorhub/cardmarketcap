"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  BarChart3, 
  Zap, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronDown,
  X 
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { useMobileMenu } from '@/context/MobileMenuContext'

const navigation = [
  {
    title: "Markets",
    icon: Activity,
    items: [{ name: "Market Overview", href: "/overview" }]
  },
  {
    title: "Indices",
    icon: BarChart3,
    collapsible: true,
    items: [
      { name: "Top 20 Index", href: "/indices/top-20" },
      { name: "Top 50 Index", href: "/indices/top-50" },
      { name: "PSA 10 Blue Chip", href: "/indices/psa-10" },
      { name: "Vintage 50 Index", href: "/indices/vintage-50" },
      { name: "Modern 100 Index", href: "/indices/modern-100" },
    ]
  },
  {
    title: "Specialty",
    icon: Zap,
    items: [
      { name: "Pikachu 20 Index", href: "/specialty/pikachu" },
      { name: "Gengar 20 Index", href: "/specialty/gengar" },
    ]
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isIndicesOpen, setIsIndicesOpen] = useState(true)
  const { isOpen, closeMenu } = useMobileMenu()
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <>
      {/* OVERLAY */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{
          // Changed: Slide from 300 (right) to 0
          x: isMobile ? (isOpen ? 0 : 300) : 0
        }}
        transition={{ type: "tween", duration: 0.25 }}
        className={cn(
          "fixed right-0 top-0 z-50 h-screen w-72 lg:w-64 flex flex-col font-sans", // Changed: right-0
          "border-l border-slate-200/50 dark:border-slate-800", // Changed: border-l (left border)
          "bg-[#F9FAFB] dark:bg-slate-950",
          "lg:static lg:translate-x-0"
        )}
      >
        {/* HEADER */}
        <div className="px-6 py-10 flex items-center justify-between">
          <Link href="/overview" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                fill 
                className="object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white font-heading">
              CardMarket<span className="text-[#00BA88]">Cap</span>
            </span>
          </Link>

          {isMobile && (
            <button 
              onClick={closeMenu} 
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 space-y-7 overflow-y-auto custom-scrollbar">
          {navigation.map((group) => {
            const isIndices = group.title === "Indices"

            return (
              <div key={group.title} className="space-y-1.5">
                <button 
                  onClick={() => isIndices && setIsIndicesOpen(!isIndicesOpen)}
                  className="flex w-full items-center justify-between px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-heading"
                >
                  {group.title}
                  {group.collapsible && (
                    <ChevronDown className={cn(
                      "h-3 w-3 transition-transform",
                      isIndicesOpen ? "" : "-rotate-90"
                    )} />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {(!group.collapsible || isIndicesOpen) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-[2px]"
                    >
                      {group.items.map((item) => {
                        const active = pathname === item.href

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => isMobile && closeMenu()}
                            className={cn(
                              "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all",
                              active
                                ? "text-white"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/30 dark:hover:bg-slate-800/50"
                            )}
                          >
                            {active && (
                              <motion.div 
                                layoutId="activeNavHighlight"
                                className="absolute inset-0 bg-[#00BA88] rounded-xl -z-10"
                              />
                            )}

                            <group.icon className={cn(
                              "h-4 w-4",
                              active ? "text-white" : "text-slate-400"
                            )} />

                            <span className={cn(
                              "text-sm truncate",
                              active ? "font-bold" : "font-medium"
                            )}>
                              {item.name}
                            </span>
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* FOOTER */}
        <div className="mt-auto p-4 border-t border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
          
          <div className="flex flex-col gap-1 mb-4 px-2">
            <Link href="/help" className="flex items-center gap-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <HelpCircle className="h-4 w-4" /> Support
            </Link>
            <Link href="/settings" className="flex items-center gap-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </div>

          <div className="flex items-center justify-between px-3 py-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                JD
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">John Doe</p>
                <p className="text-[10px] text-[#00BA88] font-bold">Pro Plan</p>
              </div>
            </div>

            <button className="text-slate-400 hover:text-red-500">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}