"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import Sidebar from "@/components/Sidebar";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // 1. Pull real user data from localStorage (same as your Navbar)
    const stored = localStorage.getItem('user_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  // Use real user data if available, fallback to defaults
  const dashboardData = {
    user: {
      name: userData?.username || "Collector",
      id: userData?.user_id || 0,
    },
    // These stats should eventually come from your getWatchlist API call, 
    // but for now we keep the structure matching your image_ca06d1.png
    stats: {
      totalValue: 48725.60,
      growth7D: 12.48,
      totalCards: 126,
      totalSets: 18,
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <Navbar /> 

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10">
        {/* Pass the dynamic data here */}
        <PortfolioHeader data={dashboardData} />
        
        <main className="py-4">
          {children}
        </main>
      </div>
    </div>
  );
}