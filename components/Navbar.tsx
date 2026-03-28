"use client"

import React, { useEffect, useState } from 'react'
import { useTheme } from "next-themes"
import { 
  Search, Bell, Moon, Sun, Menu, Command, ChevronRight
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

export default function Navbar() {
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
      <div className="flex w-full items-center justify-between">
        
        {/* 1. LEFT: BREADCRUMBS & MOBILE MENU */}
        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-slate-500 dark:text-slate-400"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span className="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors">Platform</span>
            <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-700" />
            <span className="text-slate-900 dark:text-slate-100 font-bold font-heading tracking-tight">Market Overview</span>
          </div>
        </div>

        {/* 2. RIGHT: ACTIONS & THEME */}
        <div className="flex items-center gap-2 md:gap-6">
          
          {/* SEARCH (Hidden on mobile navbar, desktop only) */}
          <div className="relative group hidden lg:block">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#00BA88] transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="h-11 w-80 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 pl-11 pr-12 text-sm outline-none transition-all focus:border-[#00BA88]/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-[#00BA88]/10 dark:text-slate-200 shadow-sm"
            />
            <div className="absolute inset-y-0 right-4 flex items-center">
              <kbd className="flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 shadow-sm">
                <Command className="h-2.5 w-2.5" /> K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 md:border-x border-slate-100 dark:border-slate-800 md:px-6">
            <Button variant="ghost" size="icon" className="relative text-slate-500 dark:text-slate-400 hover:text-slate-900 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-950" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mounted && (
                  <motion.div
                    key={resolvedTheme}
                    initial={{ y: 20, opacity: 0, rotate: 45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {resolvedTheme === 'dark' ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
{/* USER PROFILE */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="flex items-center gap-3 pl-2 outline-none group focus:outline-none">
      <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#00BA88] border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white font-bold text-xs transition-transform group-hover:scale-105 active:scale-95">
        JD
      </div>
      <div className="hidden lg:block text-left">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">John Doe</p>
        <p className="text-[10px] font-bold text-[#00BA88] uppercase tracking-wider">Pro Plan</p>
      </div>
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent 
    align="end" 
    className="w-56 mt-3 p-2 dark:bg-slate-900 dark:border-slate-800 shadow-2xl border-slate-200 backdrop-blur-xl"
  >
    <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800">
      View Profile
    </DropdownMenuItem>
    <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer dark:text-slate-300 dark:focus:bg-slate-800">
      Subscription
    </DropdownMenuItem>
    
    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2" />
    
    <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-red-600 dark:text-red-400 dark:focus:bg-red-950/30 cursor-pointer font-bold">
      Sign Out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </div>
      </div>
    </header>
  )
}