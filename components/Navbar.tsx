"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, Bell, Moon, Sun, Menu, Command, ChevronRight, Briefcase, ArrowRight 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useMobileMenu } from "@/context/MobileMenuContext"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { toggleMenu } = useMobileMenu()

  useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    if (!resolvedTheme) return
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-30 flex w-full items-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-2 md:px-8 py-3 transition-all duration-300">
      <div className="flex w-full items-center justify-between max-w-[1600px] mx-auto">
        
        {/* 1. LEFT: LOGO OR BREADCRUMBS */}
        <div className="flex items-center gap-1 md:gap-2">
          {isLandingPage ? (
            <Link href="/" className="flex items-center gap-2 group ml-1 md:ml-0">
              <div className="relative h-7 w-7 md:h-8 md:w-8 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  fill 
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="hidden sm:block text-xl font-bold tracking-tighter text-slate-900 dark:text-white font-heading">
                CardMarket<span className="text-[#00BA88]">Cap</span>
              </span>
            </Link>
          ) : (
            <>
              <div className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMenu}
                  className="text-slate-500 dark:text-slate-400 h-9 w-9"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <div className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                <Link 
                  href="/" 
                  className="group flex items-center transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <span className="relative">
                    Platform
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#00BA88] transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
                <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                <span className="text-slate-900 dark:text-slate-100 font-bold font-heading tracking-tight">
                  Market Overview
                </span>
              </div>
            </>
          )}
        </div>

        {/* 2. RIGHT: ACTIONS & THEME */}
        <div className="flex items-center gap-1 md:gap-6">
          
          {/* SEARCH - Desktop Input / Mobile Icon */}
          <div className="flex items-center">
            {/* Desktop Search Input */}
            <div className="relative group hidden lg:block">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#00BA88] transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="h-11 w-64 xl:w-80 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 pl-11 pr-12 text-sm outline-none transition-all focus:border-[#00BA88]/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-[#00BA88]/10 dark:text-slate-200 shadow-sm"
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <kbd className="flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 shadow-sm">
                  <Command className="h-2.5 w-2.5" /> K
                </kbd>
              </div>
            </div>

            {/* Mobile Search Icon - Visible only on mobile/tablet */}
            <div className="lg:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-500 dark:text-slate-400 hover:text-[#00BA88] hover:bg-[#00BA88]/10 rounded-xl h-9 w-9"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-0.5 md:gap-2 md:px-4",
            !isLandingPage && "md:border-x border-slate-100 dark:border-slate-800"
          )}>
            <AnimatePresence mode="wait">
              {isLandingPage ? (
                <motion.div key="portfolio" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-500 dark:text-slate-400 hover:text-[#00BA88] hover:bg-[#00BA88]/10 rounded-xl h-9 w-9" 
                    asChild
                  >
                    <Link href="/portfolio">
                      <Briefcase className="h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="notifications" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl h-9 w-9"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-slate-950 shadow-sm" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl h-9 w-9"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mounted && (
                    <motion.div
                      key={resolvedTheme}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                    >
                      {resolvedTheme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>

          {/* AUTH ACTIONS */}
          {isLandingPage ? (
            <div className="flex items-center gap-1 md:gap-4">
              <Button 
                variant="ghost" 
                className="hidden sm:flex font-bold text-slate-600 dark:text-slate-300" 
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
              
              <Button 
                className="bg-[#00BA88] hover:bg-[#00a377] text-white font-bold rounded-xl px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap" 
                asChild
              >
                <Link href="/overview" className="flex items-center">
                  <span className="hidden xs:inline">Get Started</span> 
                  <span className="xs:hidden">Join</span>
                  <ArrowRight className="ml-1 md:ml-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 outline-none group">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#00BA88] border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white font-bold text-[10px] md:text-xs">
                    JD
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">John Doe</p>
                    <p className="text-[10px] font-bold text-[#00BA88] uppercase tracking-wider">Pro</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl dark:bg-slate-900">
                <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer">Profile</DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer">Subscription</DropdownMenuItem>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                <DropdownMenuItem className="rounded-xl px-3 py-2 text-red-600 font-bold cursor-pointer">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}