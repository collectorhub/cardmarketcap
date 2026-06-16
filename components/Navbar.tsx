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
  Loader2,
  TrendingUp,
  Package,
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
import { globalSearch } from "@/lib/queries/globalSearch";

type NavUser = {
  id?: number;
  username: string;
  role: string;
};

type SearchItem = {
  type: "card" | "set" | "index";
  id: string | number;
  name: string;
  subtitle?: string;
  imageUrl?: string | null;
  url: string;
};

function SearchGroup({
  title,
  icon: Icon,
  items,
  onSelect,
}: {
  title: string;
  icon: any;
  items: SearchItem[];
  onSelect: (url: string) => void;
}) {
  if (!items?.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 px-2 mb-2">
        <Icon className="h-3.5 w-3.5 text-[#00BA88]" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {title}
        </p>
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={`${item.type}-${item.id}-${item.url}`}
            onClick={() => onSelect(item.url)}
            className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 text-left transition group"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <Icon className="h-4 w-4 text-slate-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-[#00BA88] transition">
                {item.name}
              </p>
              <p className="text-[11px] font-bold text-slate-400 truncate">
                {item.subtitle || "CardMarketCap result"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

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
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const [globalResults, setGlobalResults] = useState<{
    cards: SearchItem[];
    sets: SearchItem[];
    indices: SearchItem[];
    count: number;
  }>({
    cards: [],
    sets: [],
    indices: [],
    count: 0,
  });

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(async () => {
      const q = searchQuery.trim();

      if (q.length < 2) {
        setGlobalResults({ cards: [], sets: [], indices: [], count: 0 });
        setSearchOpen(false);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);

      const res = await globalSearch(q);

      setSearchLoading(false);

      if (res?.success) {
        setGlobalResults({
          cards: Array.isArray(res.cards) ? res.cards : [],
          sets: Array.isArray(res.sets) ? res.sets : [],
          indices: Array.isArray(res.indices) ? res.indices : [],
          count: Number(res.count || 0),
        });

        setSearchOpen(true);
      } else {
        setGlobalResults({ cards: [], sets: [], indices: [], count: 0 });
        setSearchOpen(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        desktopSearchRef.current &&
        desktopSearchRef.current.contains(target)
      ) {
        return;
      }

      if (mobileSearchRef.current && mobileSearchRef.current.contains(target)) {
        return;
      }

      setSearchOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const pressed = isMac ? e.metaKey && e.key === "k" : e.ctrlKey && e.key === "k";

      if (pressed) {
        e.preventDefault();
        setIsSearching(true);
        setSearchOpen(true);

        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }

      if (e.key === "Escape") {
        setSearchOpen(false);
        setIsSearching(false);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

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

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    const q = searchQuery.trim();

    if (!q) return;

    setSearchOpen(false);
    setIsSearching(false);
    setSearchQuery("");
    router.push(`/card-search?q=${encodeURIComponent(q)}`);
  };

  const handleSelectSearchResult = (url: string) => {
    setSearchOpen(false);
    setIsSearching(false);
    setSearchQuery("");
    router.push(url);
  };

  const getInitials = (name?: string) => {
    const safeName = name || "User";
    return safeName.slice(0, 2).toUpperCase();
  };

  const SearchDropdown = ({ mobile = false }: { mobile?: boolean }) => {
    const hasQuery = searchQuery.trim().length >= 2;

    if (!searchOpen || !hasQuery) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden z-[100]",
            mobile
              ? "left-3 right-3 bottom-[calc(100%+10px)]"
              : "right-0 top-[calc(100%+10px)] w-[440px]"
          )}
        >
          <div className="p-3 max-h-[520px] overflow-y-auto custom-scrollbar">
            {searchLoading ? (
              <div className="py-10 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-[#00BA88]" />
                <p className="text-xs font-bold text-slate-400">
                  Searching CardMarketCap...
                </p>
              </div>
            ) : globalResults.count > 0 ? (
              <div className="space-y-4">
                <SearchGroup
                  title="Cards"
                  icon={Search}
                  items={globalResults.cards}
                  onSelect={handleSelectSearchResult}
                />

                <SearchGroup
                  title="Sets"
                  icon={Package}
                  items={globalResults.sets}
                  onSelect={handleSelectSearchResult}
                />

                <SearchGroup
                  title="Indices"
                  icon={TrendingUp}
                  items={globalResults.indices}
                  onSelect={handleSelectSearchResult}
                />

                <button
                  onClick={() => submitSearch()}
                  className="w-full mt-2 px-4 py-3 rounded-2xl bg-[#00BA88] text-white text-xs font-black uppercase tracking-wider hover:bg-[#00a377] transition"
                >
                  View all results
                </button>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  No results found
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try a card name, set, or index.
                </p>

                <button
                  onClick={() => submitSearch()}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-black hover:text-[#00BA88] transition"
                >
                  Search all cards anyway
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
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
            <div ref={desktopSearchRef} className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#00BA88] transition-colors z-10" />

              <form onSubmit={submitSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) {
                      setSearchOpen(true);
                    }
                  }}
                  placeholder="Search assets..."
                  className="h-11 w-64 xl:w-96 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 pl-11 pr-12 text-sm outline-none transition-all focus:border-[#00BA88]/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-[#00BA88]/10 dark:text-slate-200"
                />

                <div className="absolute inset-y-0 right-4 flex items-center">
                  {searchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#00BA88]" />
                  ) : (
                    <kbd className="flex h-5 items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                      <Command className="h-2.5 w-2.5" /> K
                    </kbd>
                  )}
                </div>
              </form>

              <SearchDropdown />
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
                onClick={() => {
                  setIsSearching(true);
                  setSearchOpen(false);
                }}
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
              ref={mobileSearchRef}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative flex items-center w-full h-full px-4 gap-3"
            >
              <SearchDropdown mobile />

              <button
                onClick={() => {
                  setIsSearching(false);
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="h-10 w-10 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 rounded-xl transition-all active:scale-90"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>

              <form onSubmit={submitSearch} className="relative flex-1 group h-11">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00BA88] transition-colors"
                />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) {
                      setSearchOpen(true);
                    }
                  }}
                  placeholder="Search cards, sets, indices..."
                  className="w-full h-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl pl-10 pr-12 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
                />

                {searchLoading ? (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#00BA88]" />
                ) : searchQuery ? (
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
                    onClick={() => {
                      setIsSearching(false);
                      setSearchOpen(false);
                    }}
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