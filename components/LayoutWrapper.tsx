"use client"

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* Hide Sidebar only on the root landing page */}
      {!isLandingPage && <Sidebar />}

      <div className={cn(
        "relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden transition-all duration-300",
        isLandingPage ? "bg-white dark:bg-slate-950" : "bg-[#F8FAFC] dark:bg-slate-950"
      )}>
        <Navbar />
        <main className={cn(
          "w-full mx-auto min-h-screen",
          isLandingPage ? "p-0" : "p-4 md:p-8 max-w-[1600px]"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}