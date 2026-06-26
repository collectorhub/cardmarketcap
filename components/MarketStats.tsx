"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Activity,
  Zap,
  BarChart3,
  TrendingUp,
  Megaphone,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getActiveAdvert } from "@/lib/queries/admin/adverts";

interface MarketStatsProps {
  initialStats: any[];
}

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ElementType;
  data?: number[];
  index: number;
  subtext?: string;
  isAd?: boolean;
  advert?: any;
  adLoading?: boolean;
}

const CARD_SIZE =
  "shrink-0 w-[31.5%] md:w-full h-[115px] md:h-[150px]";

const getPath = (data: number[], width: number, height: number) => {
  const step = width / (data.length - 1);

  const points = data.map((val, i) => ({
    x: i * step,
    y: height - (val / 100) * height,
  }));

  return points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;

    const p0 = a[i - 1];
    const cp1x = p0.x + (point.x - p0.x) / 2;

    return `${acc} C ${cp1x},${p0.y} ${cp1x},${point.y} ${point.x},${point.y}`;
  }, "");
};

function StatCard({
  label,
  value,
  change,
  isPositive = true,
  icon: Icon,
  data,
  index,
  subtext,
  isAd,
  advert,
  adLoading,
}: StatCardProps) {
  const color = isPositive ? "#00BA88" : "#EF4444";
  const pathData = data ? getPath(data, 100, 40) : "";

  const adTitle = advert?.title || value || "Promoted Ad";
  const adSubtitle =
    advert?.subtitle || advert?.cta_label || advert?.ctaLabel || "Sponsored";
  const adImage = advert?.image_url || advert?.imageUrl || advert?.image;
  const adUrl = advert?.target_url || advert?.targetUrl || advert?.url;

  const handleAdClick = () => {
    if (!isAd || !adUrl) return;

    if (String(adUrl).startsWith("http")) {
      window.open(adUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = adUrl;
    }
  };

  if (isAd && adLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
        className={cn(
          CARD_SIZE,
          "relative overflow-hidden rounded-xl md:rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 md:p-6 md:shadow-sm"
        )}
      >
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="hidden md:block h-10 w-10 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 mb-5" />
            <div className="h-3 w-28 rounded-full bg-slate-200/80 dark:bg-slate-800/80 mb-4" />
          </div>

          <div>
            <div className="h-7 w-32 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 mb-3" />
            <div className="h-5 w-20 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={isAd ? handleAdClick : undefined}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
      className={cn(
        CARD_SIZE,
        "group relative flex flex-col overflow-hidden rounded-xl md:rounded-[1.5rem] border transition-all duration-300 md:shadow-sm",
        isAd ? "p-2 md:p-6" : "p-3 md:p-6",
        isAd
          ? "cursor-pointer border-emerald-200 dark:border-emerald-900/50 bg-slate-900 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/10"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#00BA88]/40"
      )}
    >
      {isAd && adImage && (
        <img
          src={adImage}
          alt={adTitle}
          className="absolute inset-0 h-full w-full object-contain md:object-cover p-2 md:p-0 transition-all duration-300 group-hover:scale-105"
        />
      )}

      {isAd && (
        <>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300" />
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20 rounded-full bg-white/90 dark:bg-slate-950/80 backdrop-blur px-2 py-1 md:px-2.5 md:py-1 text-[6px] md:text-[9px] font-black uppercase tracking-[0.12em] md:tracking-widest text-[#00BA88] whitespace-nowrap">
            Promoted Ad
          </div>
        </>
      )}

      <div
        className={cn(
          "relative z-20 flex flex-col h-full justify-between gap-2 md:gap-5 transition-all duration-300",
          isAd && "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col min-w-0 w-full">
            {!isAd && (
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider block w-full leading-tight md:leading-none md:tracking-[0.15em] text-slate-400 dark:text-slate-500">
                {label}
              </span>
            )}

            {subtext && (
              <span className="hidden md:block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-1 opacity-80">
                {subtext}
              </span>
            )}
          </div>

          {!isAd && (
            <Info className="hidden md:block h-3.5 w-3.5 text-slate-300 dark:text-slate-700 hover:text-[#00BA88] transition-colors cursor-help" />
          )}

          {isAd && adUrl && (
            <ExternalLink className="hidden md:block h-3.5 w-3.5 text-white/80" />
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-1 md:gap-2">
          <div className="min-w-0 relative z-10">
            <h3
              className={cn(
                isAd
                  ? "text-[8px] sm:text-[10px] md:text-xl xl:text-2xl leading-tight line-clamp-2"
                  : "text-[14px] sm:text-base md:text-xl xl:text-2xl truncate",
                "font-black tracking-tight",
                isAd ? "text-white" : "text-slate-900 dark:text-white"
              )}
            >
              {isAd ? adTitle : value}
            </h3>

            <div
              className={cn(
                isAd
                  ? "flex items-center gap-0.5 md:gap-1 text-[5px] sm:text-[6px] md:text-[11px] font-black mt-1 px-1 md:px-2 py-[2px] md:py-0.5 rounded-full w-fit shrink-0 whitespace-nowrap"
                  : "flex items-center gap-0.5 md:gap-1 text-[9px] md:text-[11px] font-black mt-1.5 md:mt-1 px-2 py-0.5 rounded-full w-fit shrink-0",
                isAd
                  ? "text-white bg-white/20"
                  : isPositive
                  ? "text-[#00BA88] bg-[#00BA88]/10"
                  : "text-red-500 bg-red-500/10"
              )}
            >
              {isAd ? (
                <>
                  <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3" />
                  <span className="truncate max-w-[78px] sm:max-w-[90px] md:max-w-none">
                    {adSubtitle}
                  </span>
                </>
              ) : (
                <>
                  {isPositive ? (
                    <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3" />
                  ) : (
                    <ArrowDownRight className="h-2 w-2 md:h-3 md:w-3" />
                  )}
                  {change}
                </>
              )}
            </div>
          </div>

          {data && !isAd && (
            <div className="hidden md:block h-10 w-20 shrink-0 mb-1 opacity-100">
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                </defs>

                <motion.path d={`${pathData} L 100,40 L 0,40 Z`} fill={`url(#grad-${index})`} />

                <motion.path
                  d={pathData}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {!isAd && (
        <div className="hidden md:block absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-800/30 blur-2xl group-hover:bg-[#00BA88]/10 transition-colors duration-500" />
      )}
    </motion.div>
  );
}

export function MarketStats({ initialStats }: MarketStatsProps) {
  const [homepageAd, setHomepageAd] = useState<any>(null);
  const [homepageAdLoading, setHomepageAdLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadHomepageAd() {
      try {
        setHomepageAdLoading(true);
        const res = await getActiveAdvert("homepage_stats_card");

        if (!cancelled && res?.success) {
          setHomepageAd(res.advert || null);
        }
      } catch (error) {
        console.error("Failed to load homepage advert:", error);
        if (!cancelled) setHomepageAd(null);
      } finally {
        if (!cancelled) setHomepageAdLoading(false);
      }
    }

    loadHomepageAd();

    return () => {
      cancelled = true;
    };
  }, []);

  const iconMap: Record<string, any> = {
    "TOTAL MARKET CAP": Activity,
    "TRACKED CARDS": Zap,
    "TOP 20 INDEX": TrendingUp,
    "TOP 50 INDEX": BarChart3,

    "Total Market Cap": Activity,
    "Tracked Cards": Zap,
    "Top 20 Index": TrendingUp,
    "Top 50 Index": BarChart3,
  };

  const displayStats = (initialStats || []).slice(0, 4);

  const sparklineData = useMemo(
    () =>
      displayStats.map(() =>
        Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 30)
      ),
    [displayStats.length]
  );

  return (
    <div className="w-full">
      <div className="flex md:grid md:grid-cols-5 overflow-x-auto md:overflow-x-visible gap-3 md:gap-4 lg:gap-6 items-stretch scrollbar-hide pb-2 md:pb-0">
        {displayStats.map((s, i) => (
          <StatCard
            key={s.label}
            index={i}
            label={s.label}
            value={s.value}
            change={s.change}
            isPositive={s.trend === "up"}
            icon={iconMap[s.label] || Activity}
            data={sparklineData[i]}
          />
        ))}

        <StatCard
          index={displayStats.length}
          label="Promoted Ad"
          value={homepageAd?.title || "Grading"}
          icon={Megaphone}
          isAd
          advert={homepageAd}
          adLoading={homepageAdLoading}
        />
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}