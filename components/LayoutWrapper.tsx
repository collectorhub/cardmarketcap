"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage =
    pathname === "/";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-slate-950">
      <Navbar />

      <div className="min-h-0 flex-1 overflow-hidden">
        {isLandingPage ? (
          <main className="h-full overflow-y-auto overflow-x-hidden bg-white dark:bg-slate-950">
            {children}
          </main>
        ) : (
          <div className="mx-auto flex h-full w-full max-w-[1400px] px-5 lg:px-6">
            <Sidebar />

            <main
              className={cn(
                "relative min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
                "border-l border-slate-200/60 bg-[#F8FAFC] dark:border-slate-800 dark:bg-slate-950"
              )}
            >
              <div className="min-h-full w-full px-5 py-8 md:px-7 lg:px-9 xl:px-12">
                {children}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
