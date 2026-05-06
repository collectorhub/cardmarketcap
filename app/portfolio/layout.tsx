"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import Sidebar from "@/components/Sidebar";
import { getWatchlist } from "@/lib/queries/portfolio"; // Import your fetch function

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalValue: 0,
    growth7D: 0,
    totalCards: 0,
    totalSets: 0,
  });

  useEffect(() => {
    // 1. Get user from localStorage
    const stored = localStorage.getItem('user_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
        
        // 2. Fetch real stats from your PHP backend
        if (parsed.user_id) {
          fetchDashboardData(parsed.user_id);
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const fetchDashboardData = async (userId: number) => {
    const response = await getWatchlist(userId);
    
    if (response.success && response.data) {
      // Mapping your PHP backend fields to the UI state
      // totalValue: 0, totalCards: 14, setCount: 10 from your screenshot
      setStats({
        totalValue: response.data.totalValue || 0,
        growth7D: response.data.growth7D || 0,
        totalCards: response.data.totalCards || 0,
        totalSets: response.data.setCount || 0,
      });
    }
  };

  // Combine user info and real stats
  const dashboardData = {
    user: {
      name: userData?.username || "Collector",
      id: userData?.user_id || 0,
    },
    stats: stats
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <Navbar /> 

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10">
        {/* Now passing real data fetched from watchlist.php */}
        <PortfolioHeader data={dashboardData} />
        
        <main className="py-4">
          {children}
        </main>
      </div>
    </div>
  );
}