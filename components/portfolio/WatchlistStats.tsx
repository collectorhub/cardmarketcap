// components/portfolio/WatchlistStats.tsx
import { cn } from '@/lib/utils';
import { Wallet, Layers, Bell, LineChart, TrendingUp, TrendingDown } from 'lucide-react';

export const WatchlistStats = ({ data }: { data: any }) => {
  // Extract real values from your PHP response with fallbacks
  const totalValue = data?.totalValue || 0;
  const growth7D = data?.growth7D || 0;
  const isPositive = growth7D >= 0;

  const stats = [
    {
      label: "Watchlist Value",
      value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      trend: `${growth7D}% (7D)`,
      icon: Wallet,
      colors: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
      trendColor: isPositive ? "text-emerald-500" : "text-red-500"
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
      value: `$${(data?.avgDailyChange || 0).toFixed(2)}`,
      trend: "0.00%", // Logic for this can be added to your PHP later
      icon: LineChart,
      colors: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
      trendColor: "text-slate-400"
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div 
          key={idx}
          className="bg-white dark:bg-slate-900 p-6 rounded-[22px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.colors)}>
            <stat.icon size={22} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <h4 className="text-[22px] font-black text-slate-900 dark:text-white tracking-tight leading-none truncate">
              {stat.value}
            </h4>
            
            <div className="flex items-center gap-1.5 mt-1.5">
              {stat.trend ? (
                <p className={cn("text-[11px] font-bold flex items-center gap-0.5", stat.trendColor)}>
                  {isPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
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