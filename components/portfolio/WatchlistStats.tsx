// components/portfolio/WatchlistStats.tsx
import { cn } from '@/lib/utils';
import { Wallet, Layers, Bell, LineChart, TrendingUp } from 'lucide-react';

export const WatchlistStats = ({ data }: { data: any }) => {
  // Configuration for the 4 specific cards
  const stats = [
    {
      label: "Watchlist Value",
      value: `$${data?.totalValue?.toLocaleString() ?? '0.00'}`,
      trend: "9.72% (7D)",
      icon: Wallet,
      colors: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Total Cards",
      value: data?.totalCards ?? 0,
      subValue: `Across ${data?.setCount ?? 0} Sets`,
      icon: Layers,
      colors: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10",
    },
    {
      label: "Alerts Active",
      value: data?.activeAlerts ?? 0,
      subValue: "Price & Market",
      icon: Bell,
      colors: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
    },
    {
      label: "Avg. Daily Change",
      value: `$${data?.avgDailyChange ?? '0.00'}`,
      trend: "0.98%",
      icon: LineChart,
      colors: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div 
          key={idx}
          // Tweak 1: Shadow updated to match WatchlistHero exactly
          className="bg-white dark:bg-slate-900 p-6 rounded-[22px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.colors)}>
            <stat.icon size={22} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            {/* Tweak 2: Font changed to font-black and tracking-tight to match Hero */}
            <h4 className="text-[22px] font-black text-slate-900 dark:text-white tracking-tight leading-none truncate">
              {stat.value}
            </h4>
            
            <div className="flex items-center gap-1.5 mt-1.5">
              {stat.trend ? (
                <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5">
                  <TrendingUp size={12} strokeWidth={3} />
                  {stat.trend}
                </p>
              ) : (
                <p className="text-[11px] font-bold text-slate-400 truncate uppercase tracking-tight">
                  {stat.subValue}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};