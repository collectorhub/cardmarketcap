"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import Sidebar from "@/components/Sidebar";
import { getPortfolio } from "@/lib/queries/portfolio"; // ✅ Updated function name

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalValue: 0,
    growth7D: 0,
    totalCards: 0,
    totalSets: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem('user_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
        
        // Grab either identifier structure matching your localstorage setup
        const userId = parsed.id || parsed.user_id;
        if (userId) {
          fetchDashboardData(userId);
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const fetchDashboardData = async (userId: number) => {
    const response = await getPortfolio(userId);
    
    if (response.success && response.data) {
      const apiData = response.data;
      const backendStats = apiData.stats || {};
      const backendPerformance = apiData.performance || {};

      // ✅ Drilled down directly into backend data nested structural keys
      setStats({
        totalValue: backendStats.totalValue || 0,
        growth7D: backendPerformance.change7DPct || 0,
        totalCards: backendStats.totalCards || 0,
        totalSets: backendStats.totalSets || 0,
      });
    }
  };

  const dashboardData = {
    user: {
      name: userData?.username || "Collector",
      id: userData?.id || userData?.user_id || 0,
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
        <PortfolioHeader data={dashboardData} />
        
        <main className="py-4">
          {children}
        </main>
      </div>
    </div>
  );
}