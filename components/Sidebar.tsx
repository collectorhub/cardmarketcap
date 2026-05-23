"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, BarChart3, Zap, Settings, HelpCircle, 
  LogOut, ChevronDown, X, Layers, UserRoundPlus, 
  LogIn, PackageSearch, LayoutDashboard, Terminal, 
  ShieldAlert, Database, ArrowLeft, ClipboardList, Coins,
  ShieldCheck
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useMobileMenu } from '@/context/MobileMenuContext';
import Cookies from 'js-cookie'

// Public Desktop Navigation
const desktopNavigation = [
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
];

// Public Mobile Navigation
const mobileNavigation = [
  { name: "Market overview", href: "/overview", icon: BarChart3 },
  { name: "Card sets", href: "/sets", icon: Layers },
  { name: "Card Search", href: "/card-search", icon: PackageSearch },
  { name: "Sign in", href: "/sign-in", icon: LogIn },
  { name: "Sign up", href: "/sign-up", icon: UserRoundPlus, isButton: true },
];

// --- ADMIN PANEL NAVIGATION ---
const adminDesktopNavigation = [
  {
    title: "System Control",
    icon: ShieldAlert,
    items: [
      { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Pipeline Monitor", href: "/admin/pipelines", icon: Terminal },
    ]
  },
  {
    title: "Data Quality & QA",
    icon: ClipboardList,
    collapsible: true,
    items: [
      { name: "QA Reporting Center", href: "/admin/qa-reporting", icon: ClipboardList },
      { name: "Matching Queue", href: "/admin/matching", icon: Layers },
    ]
  },
  {
    title: "Data Management",
    icon: Database,
    items: [
      { name: "Card Catalogue", href: "/admin/catalogue", icon: PackageSearch },
      { name: "PSA Pop Manager", href: "/admin/psa", icon: Activity },
      { name: "Pricing & Sales", href: "/admin/pricing", icon: Coins },
      { name: "Overrides & Mappings", href: "/admin/mappings", icon: Settings },
    ]
  }
];

const adminMobileNavigation = [
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "QA Reports", href: "/admin/qa", icon: ClipboardList },
  { name: "Matching Queue", href: "/admin/matching", icon: Layers },
  { name: "PSA Manager", href: "/admin/psa", icon: Activity },
];


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, closeMenu } = useMobileMenu();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Dynamic open states for collapsible navigation headings
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Indices": true,
    "Data Quality & QA": true,
  });

  // State for user data
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check for user on mount
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    Cookies.remove('user_token', { path: '/' }); 
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    router.push('/sign-in');
    if (isMobile) closeMenu();
  };

  if (!mounted) return null;

  // Role and route contextual checks
  const isAdminUser = user?.role?.toLowerCase() === 'admin';
  const isInAdminRoute = pathname.startsWith('/admin');
  const showAdminMenu = isInAdminRoute;
  // isAdminUser && 

  // Toggle navigation groups dynamically
  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const currentDesktopNav = showAdminMenu ? adminDesktopNavigation : desktopNavigation;
  const currentMobileNav = showAdminMenu ? adminMobileNavigation : mobileNavigation;

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            key="overlay" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={closeMenu} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" 
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isMobile ? (isOpen ? 0 : "100%") : 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed right-0 top-0 z-[70] h-full w-72 lg:w-64 flex flex-col font-sans",
          "border-l border-slate-200/50 dark:border-slate-800",
          showAdminMenu ? "bg-slate-50 dark:bg-slate-950" : "bg-[#F9FAFB] dark:bg-slate-950",
          "lg:static lg:translate-x-0 lg:border-l-0 lg:border-r"
        )}
      >
        {/* HEADER */}
        {isMobile ? (
          <div className="px-6 py-10 flex items-center justify-between">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-2 group">
              <div className="relative h-8 w-8 flex-shrink-0">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white font-heading">
                CardMarket<span className="text-[#00BA88]">Cap</span>
              </span>
            </Link>
            <button onClick={closeMenu} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <div className="h-4" />
        )}

        {/* ADMIN MODE CONTEXT SWITCH INDICATOR */}
        {showAdminMenu && (
          <div className="px-4 mb-4 hidden lg:block">
            <div className="p-3 bg-[#00BA88]/5 border border-[#00BA88]/10 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#00BA88]">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider font-heading">Admin Control</span>
              </div>
              <Link 
                href="/overview" 
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Exit to Public App
              </Link>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 space-y-7 overflow-y-auto custom-scrollbar">
          {isMobile ? (
            <div className="space-y-2">
              {/* Optional: Add clear jump link on mobile viewports */}
              {showAdminMenu && (
                <Link
                  href="/overview"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-200/50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  <ArrowLeft className="h-4 w-4 text-[#00BA88]" /> Exit Admin Control Center
                </Link>
              )}
              {currentMobileNav.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    onClick={closeMenu} 
                    className={cn(
                      "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all", 
                      isActive ? "text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/30"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="mobileSidebarHighlight" 
                        className="absolute inset-0 bg-[#00BA88] rounded-xl -z-10" 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                      />
                    )}
                    <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "group-hover:text-[#00BA88]")} />
                    <span className={cn("text-sm transition-colors", isActive ? "font-bold" : "font-medium group-hover:text-[#00BA88]")}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            currentDesktopNav.map((group) => {
              const isGroupOpen = openGroups[group.title] !== false;
              
              return (
                <div key={group.title} className="space-y-1.5">
                  <button 
                    onClick={() => group.collapsible && toggleGroup(group.title)} 
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-heading",
                      group.collapsible && "hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    )}
                  >
                    {group.title}
                    {group.collapsible && <ChevronDown className={cn("h-3 w-3 transition-transform", isGroupOpen ? "" : "-rotate-90")} />}
                  </button>
                  <AnimatePresence initial={false}>
                    {(!group.collapsible || isGroupOpen) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        className="space-y-[2px]"
                      >
                        {group.items.map((item) => {
                          // Clean absolute equality matching for dashboard routing base `/admin` vs sub-routes
                          const active = item.href === "/admin" ? pathname === "/admin" : pathname === item.href;
                          const NavIcon = item.icon || group.icon;

                          return (
                            <Link 
                              key={item.name} 
                              href={item.href} 
                              className={cn(
                                "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all", 
                                active ? "text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/30"
                              )}
                            >
                              {active && <motion.div layoutId="activeNavHighlight" className="absolute inset-0 bg-[#00BA88] rounded-xl -z-10" />}
                              <NavIcon className="h-4 w-4" />
                              <span className={cn("text-sm", active ? "font-bold" : "font-medium")}>{item.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </nav>

        {/* FOOTER - Dynamic User Profile */}
        <div className="mt-auto p-4 border-t border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
          {user ? (
            <div className="flex items-center justify-between px-3 py-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl transition-all hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#00BA88] flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user.username)}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">
                    {user.username}
                  </p>
                  <p className="text-[10px] text-[#00BA88] font-bold uppercase tracking-wider">
                    {user.role || 'Member'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </motion.aside>
    </>
  );
}