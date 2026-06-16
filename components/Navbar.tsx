"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Moon,
  Sun,
  Menu,
  Command,
  Briefcase,
  ArrowRight,
  Home,
  LogIn,
  X,
  ArrowLeft,
  LogOut,
  User,
  CreditCard,
  Layers,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

type NavUser = {
  id?: number;
  username: string;
  role: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toggleMenu } = useMobileMenu();

  const [user, setUser] = useState<NavUser | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  useEffect(() => {
    setMounted(true);

    const checkUser = () => {
      const storedUser = localStorage.getItem("user_data");

      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    window.addEventListener("auth:changed", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("auth:changed", checkUser);
    };
  }, []);

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");

    Cookies.remove("user_token", { path: "/" });

    setUser(null);

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth:changed"));

    router.push("/sign-in");
  };

  const toggleTheme = () => {
    if (!resolvedTheme) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (searchQuery.trim()) {
      setIsSearching(false);
      setSearchQuery("");
    }
  };

  const getInitials = (name?: string) => {
    const safeName = name || "User";
    return safeName.slice(0, 2).toUpperCase();
  };

  const MobileTab = ({
    href,
    icon: Icon,
    label,
    onClick,
  }: {
    href?: string;
    icon: any;
    label: string;
    onClick?: () => void;
  }) => {
    const isActive = href
      ? href === "/"
        ? pathname === "/"
        : pathname.startsWith(href)
      : false;

    const content = (
      <div className="flex flex-col items-center justify-center gap-1 w-full h-full relative">
        {isActive && (
          <motion.div
            layoutId="mobile-nav-indicator"
            className="absolute top-0 h-1 w-12 bg-[#00BA88] rounded-b-full"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}

        <Icon
          className={cn(
            "h-5 w-5 transition-colors",
            isActive
              ? "text-[#00BA88]"
              : "text-slate-500 dark:text-slate-400"
          )}
        />

        <span
          className={cn(
            "text-[10px] font-bold transition-colors",
            isActive
              ? "text-[#00BA88]"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          {label}
        </span>
      </div>
    );

    if (onClick) {
      return (
        <button
          onClick={onClick}
          className="flex-1 h-full active:scale-90 transition-transform cursor-pointer"
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        href={href || "/"}
        className="flex-1 h-full active:scale-90 transition-transform"
      >
        {content}
      </Link>
    );
  };

  return (
    <>
      {/* MOBILE TOP HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-11 w-11">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>

          <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white font-heading">
            CardMarket<span className="text-[#00BA88]">Cap</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-xl h-9 w-9",
                pathname.startsWith("/admin")
                  ? "text-[#00BA88] bg-[#00BA88]/10"
                  : "text-slate-500"
              )}
              asChild
            >
              <Link href="/admin">
                <ShieldCheck className="h-5 w-5" />
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-500 rounded-xl h-9 w-9"
          >
            {mounted &&
              (resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5" />
              ))}
          </Button>
        </div>
      </div>

      {/* DESKTOP HEADER */}
      <header className="hidden md:flex sticky top-0 z-40 w-full items-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-8 py-3 transition-all duration-300">
        <div className="flex w-full items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-10 w-10 flex-shrink-0">
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

            <nav className="flex items-center gap-8 border-l border-slate-200 dark:border-slate-800 pl-8 ml-4">
              {[
                { href: "/overview", label: "Market Overview" },
                { href: "/sets", label: "Card Sets" },
                { href: "/card-search", label: "Card Search" },
              ].map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-bold transition-all whitespace-nowrap relative py-1",
                      isActive
                        ? "text-[#00BA88]"
                        : "text-slate-500 dark:text-slate-400 hover:text-[#00BA88]"
                    )}
                  >
                    {link.label}

                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00BA88] rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-black transition-all whitespace-nowrap relative py-1",
                    pathname.startsWith("/admin")
                      ? "text-[#00BA88]"
                      : "text-slate-500 dark:text-slate-400 hover:text-[#00BA88]"
                  )}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin

                  {pathname.startsWith("/admin") && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00BA88] rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )}
            </nav>
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

            <div className="flex items-center gap-2 px-4 border-l border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-slate-500 rounded-xl h-9 w-9"
              >
                {mounted &&
                  (resolvedTheme === "dark" ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  ))}
              </Button>

              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-500 dark:hover:text-slate-100 rounded-xl h-9 w-9"
                  asChild
                >
                  <Link href="/portfolio">
                    <Briefcase className="h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>

            {!user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/sign-in"
                  className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#00BA88] transition-colors"
                >
                  Sign In
                </Link>

                <Button
                  className="bg-[#00BA88] hover:bg-[#00a377] text-white font-bold rounded-xl px-6 py-3 shadow-lg shadow-emerald-500/20 active:scale-95"
                  asChild
                >
                  <Link href="/sign-up" className="flex items-center">
                    Sign up <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-1 outline-none group">
                    <div className="h-10 w-10 rounded-full bg-[#00BA88] border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white font-bold text-xs transition-transform group-hover:scale-105">
                      {getInitials(user.username)}
                    </div>

                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#00BA88] transition-colors truncate max-w-[100px]">
                        {user.username}
                      </p>

                      <p className="text-[10px] font-bold text-[#00BA88] uppercase tracking-wider">
                        {user.role || "Member"}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2 p-1.5 rounded-2xl dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl"
                >
                  {isAdmin && (
                    <>
                      <DropdownMenuItem
                        className="rounded-xl px-3 py-2.5 cursor-pointer gap-2 focus:bg-[#00BA88]/10 text-[#00BA88] font-black"
                        asChild
                      >
                        <Link href="/admin">
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>

                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                    </>
                  )}

                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer gap-2 focus:bg-slate-100 dark:focus:bg-slate-800">
                    <User className="h-4 w-4 text-slate-500" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer gap-2 focus:bg-slate-100 dark:focus:bg-slate-800">
                    <CreditCard className="h-4 w-4 text-slate-500" />
                    Subscription
                  </DropdownMenuItem>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl px-3 py-2.5 text-red-600 font-bold cursor-pointer gap-2 focus:bg-red-50 dark:focus:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE TAB BAR */}
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

              <MobileTab href="/portfolio" icon={Briefcase} label="Portfolio" />

              <MobileTab
                onClick={() => setIsSearching(true)}
                icon={Search}
                label="Search"
              />

              {!user ? (
                <>
                  <MobileTab href="/sign-in" icon={LogIn} label="Sign In" />
                  <MobileTab onClick={toggleMenu} icon={Menu} label="Menu" />
                </>
              ) : (
                <>
                  {isAdmin ? (
                    <MobileTab
                      href="/admin"
                      icon={ShieldCheck}
                      label="Admin"
                    />
                  ) : (
                    <MobileTab href="/sets" icon={Layers} label="Sets" />
                  )}

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

              <form
                onSubmit={handleSearchSubmit}
                className="relative flex-1 group h-11"
              >
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

                {searchQuery ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-1 top-1 bottom-1 flex items-center px-1"
                  >
                    <button
                      type="submit"
                      className="h-8 w-8 bg-[#00BA88] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                    >
                      <ArrowRight size={16} strokeWidth={3} />
                    </button>
                  </motion.div>
                ) : (
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
  );
}