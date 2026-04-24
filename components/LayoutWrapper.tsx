"use client"

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* 1. Navbar stays at the very top, full width */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Sidebar and Main content live in this flex container below Navbar */}
        {!isLandingPage && <Sidebar />}

        <main className={cn(
          "relative flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300",
          isLandingPage ? "bg-white dark:bg-slate-950 p-0" : "bg-[#F8FAFC] dark:bg-slate-950 p-4 md:p-8"
        )}>
          <div className={cn("mx-auto min-h-screen", !isLandingPage && "max-w-[1600px]")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}