"use client"

import React, { useEffect, useState, useRef } from 'react'
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, Bell, Moon, Sun, Menu, Command, ChevronRight, 
  Briefcase, ArrowRight, Home, UserPlus, LogIn, X, ArrowLeft,
  UserRoundPlus
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

  // --- SEARCH STATES ---
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearching])

  const toggleTheme = () => {
    if (!resolvedTheme) return
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      console.log("Search query submitted:", searchQuery)
      // Logic for router.push will go here
      setIsSearching(false)
      setSearchQuery("")
    }
  }

  const MobileTab = ({ href, icon: Icon, label, onClick, badge }: any) => {
    const isActive = pathname === href
    const content = (
      <div className="flex flex-col items-center justify-center gap-1 w-full h-full relative">
        <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-[#00BA88]" : "text-slate-500 dark:text-slate-400")} />
        <span className={cn("text-[10px] font-bold transition-colors", isActive ? "text-[#00BA88]" : "text-slate-500 dark:text-slate-400")}>
          {label}
        </span>
        {badge && (
          <span className="absolute top-2 right-1/4 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-slate-950" />
        )}
      </div>
    )

    if (onClick) {
      return (
        <button onClick={onClick} className="flex-1 h-full active:scale-90 transition-transform cursor-pointer">
          {content}
        </button>
      )
    }

    return (
      <Link href={href} className="flex-1 h-full active:scale-90 transition-transform">
        {content}
      </Link>
    )
  }

  return (
    <>
      {/* --- MOBILE TOP HEADER --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="relative h-11 w-11">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-black tracking-tighter dark:text-white">
            CardMarket<span className="text-[#00BA88]">Cap</span>
          </span>
        </div>
        
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-500 rounded-xl h-9 w-9">
          {mounted && (resolvedTheme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />)}
        </Button>
      </div>

      {/* --- DESKTOP HEADER (Modified for Breadcrumbs) --- */}
      <header className="hidden md:flex sticky top-0 z-40 w-full items-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-8 py-3 transition-all duration-300">
        <div className="flex w-full items-center justify-between max-w-[1600px] mx-auto">
          
          <div className="flex items-center gap-2">
            {isLandingPage ? (
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain transition-transform duration-500 group-hover:scale-110" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white font-heading">
                  CardMarket<span className="text-[#00BA88]">Cap</span>
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Link href="/" className="group flex items-center transition-colors hover:text-slate-900 dark:hover:text-slate-100">
                  <span className="relative">Platform<span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#00BA88] transition-all duration-300 group-hover:w-full" /></span>
                </Link>
                <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                <span className="text-slate-900 dark:text-slate-100 font-bold font-heading tracking-tight">Market Overview</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#00BA88] transition-colors" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="h-11 w-64 xl:w-80 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 pl-11 pr-12 text-sm outline-none transition-all focus:border-[#00BA88]/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-[#00BA88]/10 dark:text-slate-200"
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <kbd className="flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                  <Command className="h-2.5 w-2.5" /> K
                </kbd>
              </div>
            </div>

            <div className={cn("flex items-center gap-2 px-4", !isLandingPage && "border-x border-slate-100 dark:border-slate-800")}>
              <Button variant="ghost" size="icon" className="text-slate-500 rounded-xl h-9 w-9" asChild>
                <Link href="/sign-up"><Briefcase className="h-5 w-5" /></Link>
              </Button>
              
              {!isLandingPage && (
                <Button variant="ghost" size="icon" className="relative text-slate-500 rounded-xl h-9 w-9">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-slate-950" />
                </Button>
              )}

              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-500 rounded-xl h-9 w-9">
                {mounted && (resolvedTheme === 'dark' ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />)}
              </Button>
            </div>

            {isLandingPage ? (
              <div className="flex items-center gap-4">
                <Link href="/sign-in" className="text-sm font-bold text-slate-600 dark:text-slate-300">Sign In</Link>
                <Button className="bg-[#00BA88] hover:bg-[#00a377] text-white font-bold rounded-xl px-6 py-3 shadow-lg shadow-emerald-500/20 active:scale-95" asChild>
                  <Link href="/sign-up" className="flex items-center">Sign up <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-1 outline-none">
                    <div className="h-10 w-10 rounded-full bg-[#00BA88] border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white font-bold text-xs">JD</div>
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

      {/* --- MOBILE TAB BAR & SEARCH --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 h-16 pb-safe flex items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <AnimatePresence mode="wait">
          {!isSearching ? (
            <motion.div 
              key="nav-links"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center w-full h-full"
            >
              <MobileTab href="/" icon={Home} label="Home" />
              <MobileTab href="/overview" icon={Briefcase} label="Market" />
              <MobileTab 
                onClick={() => setIsSearching(true)} 
                icon={Search} 
                label="Search" 
              />
              {isLandingPage ? (
                <>
                  <MobileTab href="/sign-in" icon={LogIn} label="Sign In" />
                  <MobileTab href="/sign-up" icon={UserRoundPlus} label="Join" />
                </>
              ) : (
                <>
                  <MobileTab onClick={() => {}} icon={Bell} label="Alerts" badge />
                  <MobileTab onClick={toggleMenu} icon={Menu} label="Menu" />
                </>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="search-input"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="flex items-center w-full h-full px-4 gap-3"
            >
              <button 
                onClick={() => setIsSearching(false)}
                className="h-10 w-10 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 rounded-xl transition-all active:scale-90"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>

              <form onSubmit={handleSearchSubmit} className="relative flex-1 group h-11">
                <Search 
                  size={18} 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00BA88] transition-colors" 
                />
                
                <input 
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards, sets..."
                  className="w-full h-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl pl-10 pr-12 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
                />

                <AnimatePresence>
                  {searchQuery && (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute right-1 top-1 bottom-1 flex items-center px-1"
                    >
                      <button 
                        type="submit"
                        className="h-8 w-8 bg-[#00BA88] text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-90 transition-transform"
                      >
                        <ArrowRight size={16} strokeWidth={3} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setIsSearching(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}