"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart3,
  Zap,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Layers,
  UserRoundPlus,
  LogIn,
  PackageSearch,
  LayoutDashboard,
  Terminal,
  ShieldAlert,
  Database,
  ArrowLeft,
  ClipboardList,
  Coins,
  ShieldCheck,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobileMenu } from "@/context/MobileMenuContext";
import Cookies from "js-cookie";
import { getIndices } from "@/lib/queries/indices";

type IndexNavItem = {
  id?: number;
  name: string;
  href?: string;
  slug?: string;
  category?: "market" | "index" | "specialty";
  cardCount?: number;
};

function getIndexHref(item: IndexNavItem) {
  if (item.slug) return `/overview/indices/${item.slug}`;

  if (item.href?.startsWith("/indices/")) {
    return item.href.replace("/indices/", "/overview/indices/");
  }

  if (item.href?.startsWith("/overview/indices/")) {
    return item.href;
  }

  return "";
}

const fallbackGroupedIndices = {
  market: [],
  index: [],
  specialty: [],
};

const adminDesktopNavigation = [
  {
    title: "System Control",
    icon: ShieldAlert,
    items: [
      { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Pipeline Monitor", href: "/admin/pipeline-monitor", icon: Terminal },
    ],
  },
  {
    title: "Data Quality & QA",
    icon: ClipboardList,
    collapsible: true,
    items: [
      { name: "QA Reporting Center", href: "/admin/qa-reporting", icon: ClipboardList },
      { name: "Matching Queue", href: "/admin/matching-queue", icon: Layers },
    ],
  },
  {
    title: "Data Management",
    icon: Database,
    items: [
      { name: "Card Catalogue", href: "/admin/catalogue", icon: PackageSearch },
      { name: "Index Builder", href: "/admin/indices", icon: BarChart3 },
      { name: "PSA Pop Manager", href: "/admin/psa-pop-manager", icon: Activity },
      { name: "Pricing & Sales", href: "/admin/pricing-sales", icon: Coins },
      { name: "Overrides & Mappings", href: "/admin/overrides-mappings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, closeMenu } = useMobileMenu();

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [groupedIndices, setGroupedIndices] = useState<any>(fallbackGroupedIndices);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Indices: true,
    "Data Quality & QA": true,
  });
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    setMounted(true);

    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    const check = () => setIsMobile(window.innerWidth < 1024);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    async function loadDynamicIndices() {
      const res = await getIndices();

      if (res?.success && res.grouped) {
        setGroupedIndices({
          market: Array.isArray(res.grouped.market) ? res.grouped.market : [],
          index: Array.isArray(res.grouped.index) ? res.grouped.index : [],
          specialty: Array.isArray(res.grouped.specialty) ? res.grouped.specialty : [],
        });
      } else {
        setGroupedIndices(fallbackGroupedIndices);
      }
    }

    loadDynamicIndices();
  }, []);

  const showAdminMenu = pathname.startsWith("/admin");

  const publicDesktopNavigation = useMemo(() => {
    const indexItems = (groupedIndices.index || [])
      .map((item: IndexNavItem) => ({
        name: item.name,
        href: getIndexHref(item),
        icon: BarChart3,
      }))
      .filter((item: any) => item.href);

    const specialtyItems = (groupedIndices.specialty || [])
      .map((item: IndexNavItem) => ({
        name: item.name,
        href: getIndexHref(item),
        icon: Zap,
      }))
      .filter((item: any) => item.href);

    const nav: any[] = [
      {
        title: "Markets",
        icon: Activity,
        items: [{ name: "Market Overview", href: "/overview", icon: Activity }],
      },
    ];

    if (indexItems.length > 0) {
      nav.push({
        title: "Indices",
        icon: BarChart3,
        collapsible: true,
        items: indexItems,
      });
    }

    if (specialtyItems.length > 0) {
      nav.push({
        title: "Specialty",
        icon: Zap,
        items: specialtyItems,
      });
    }

    return nav;
  }, [groupedIndices]);

  const currentDesktopNav = showAdminMenu ? adminDesktopNavigation : publicDesktopNavigation;

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    Cookies.remove("user_token", { path: "/" });
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    router.push("/sign-in");
    if (isMobile) closeMenu();
  };

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  const isActiveHref = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/") return pathname === "/";
    if (href === "/overview") return pathname === "/overview";

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (!mounted) return null;

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
            className="fixed inset-0 bg-slate-900/55 backdrop-blur-[3px] z-[60]"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isMobile ? (isOpen ? 0 : "100%") : 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className={cn(
          "fixed right-0 top-0 z-[70] h-full w-[82vw] max-w-[390px] lg:w-64 lg:max-w-none flex flex-col font-sans",
          "lg:static lg:translate-x-0",
          isMobile
            ? "bg-white dark:bg-slate-950 border-l border-slate-200/70 dark:border-slate-800 shadow-2xl"
            : "bg-[#F9FAFB] dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800"
        )}
      >
        {isMobile && (
          <div className="px-6 pt-8 pb-5 flex items-start justify-between">
            <div>
              <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
                <div className="relative h-8 w-8 shrink-0">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                </div>

                <span className="text-[25px] leading-none font-black tracking-tighter text-slate-900 dark:text-white font-heading">
                  CardMarket<span className="text-[#00BA88]">Cap</span>
                </span>
              </Link>

              <p className="mt-5 text-[15px] font-medium text-slate-500 dark:text-slate-400">
                Track. Value. Collect.
              </p>
            </div>

            <button
              onClick={closeMenu}
              className="p-2 rounded-2xl text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            >
              <X className="h-7 w-7" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {!isMobile && <div className="h-4" />}

        {showAdminMenu && !isMobile && (
          <div className="px-4 mb-4 hidden lg:block">
            <div className="p-3 bg-[#00BA88]/5 border border-[#00BA88]/10 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#00BA88]">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider font-heading">
                  Admin Control
                </span>
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
          {showAdminMenu && isMobile && (
            <Link
              href="/overview"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00BA88]/10 border border-[#00BA88]/10 text-[#00BA88] text-xs font-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit Admin Control Center
            </Link>
          )}

          {currentDesktopNav.map((group) => {
            const isGroupOpen = openGroups[group.title] !== false;

            return (
              <div key={group.title} className="space-y-1.5">
                <button
                  onClick={() => group.collapsible && toggleGroup(group.title)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-heading",
                    group.collapsible &&
                      "hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  )}
                >
                  {group.title}
                  {group.collapsible && (
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        isGroupOpen ? "" : "-rotate-90"
                      )}
                    />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {(!group.collapsible || isGroupOpen) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-[2px]"
                    >
                      {group.items.map((item: any) => {
                        const active = isActiveHref(item.href);
                        const NavIcon = item.icon || group.icon;

                        return (
                          <Link
                            key={`${item.name}-${item.href}`}
                            href={item.href}
                            onClick={isMobile ? closeMenu : undefined}
                            className={cn(
                              "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all",
                              active
                                ? "text-white"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-slate-900"
                            )}
                          >
                            {active && (
                              <motion.div
                                layoutId="activeNavHighlight"
                                className="absolute inset-0 bg-[#00BA88] rounded-xl -z-10"
                              />
                            )}

                            <NavIcon className="h-4 w-4" />
                            <span className={cn("text-sm", active ? "font-bold" : "font-medium")}>
                              {item.name}
                            </span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {isMobile && (
            <div className="space-y-1.5">
              <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-heading">
                Account
              </p>

              {user ? (
                <>
                  <Link
                    href="/portfolio"
                    onClick={closeMenu}
                    className={cn(
                      "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all",
                      pathname === "/portfolio"
                        ? "text-white"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-slate-900"
                    )}
                  >
                    {pathname === "/portfolio" && (
                      <motion.div
                        layoutId="activeNavHighlight"
                        className="absolute inset-0 bg-[#00BA88] rounded-xl -z-10"
                      />
                    )}
                    <Layers className="h-4 w-4" />
                    <span className="text-sm font-medium">Portfolio</span>
                  </Link>

                  <Link
                    href="/portfolio/watchlist"
                    onClick={closeMenu}
                    className={cn(
                      "group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all",
                      isActiveHref("/portfolio/watchlist")
                        ? "text-white"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-slate-900"
                    )}
                  >
                    {isActiveHref("/portfolio/watchlist") && (
                      <motion.div
                        layoutId="activeNavHighlight"
                        className="absolute inset-0 bg-[#00BA88] rounded-xl -z-10"
                      />
                    )}
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Watchlist</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#00BA88] text-white transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm font-bold">Sign in</span>
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#00BA88]/50 text-[#00BA88] transition-all"
                  >
                    <UserRoundPlus className="h-4 w-4" />
                    <span className="text-sm font-bold">Sign up</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>

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
                    {user.role || "Member"}
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
          ) : isMobile ? (
            <div className="flex items-center justify-between text-[12px] text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <span>About</span>
                <span>•</span>
                <span>Support</span>
                <span>•</span>
                <span>Privacy</span>
              </div>
              <span>v1.0.0</span>
            </div>
          ) : null}
        </div>
      </motion.aside>
    </>
  );
}