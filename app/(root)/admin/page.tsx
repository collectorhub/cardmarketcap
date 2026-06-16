"use client";

import React, { useEffect, useState } from "react";
import {
  Database,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";
import DashboardHeader from "@/components/admin/DashboardHeader";
import MetricCard from "@/components/admin/MetricCard";
import UserEngagementMetrics from "@/components/admin/UserEngagementMetrics";
import QaIntegrityReport from "@/components/admin/QaIntegrityReport";
import UserActivityOversight from "@/components/admin/UserActivityOversight";
import { getAdminDashboard } from "@/lib/queries/admin/dashboard";

export interface CollectorActivity {
  id: string;
  type: "portfolio" | "watchlist" | "flagged";
  user: string;
  detail: string;
  meta?: string;
  time: string;
}

const defaultMetrics = {
  totalCardsLabel: "0",
  totalExpansionsLabel: "0",
  frontendCardsLabel: "0",
  assetsLabel: "0",
  totalWatchlists: 0,
};

const defaultEngagement = {
  totalActiveUsers: 0,
  registeredPercentage: 0,
  premiumSubscribers: 0,
  billingPercentage: 0,
  watchlistConversionRate: 0,
};

const defaultQa = {
  totalAlerts: 0,
  alerts: [],
};

function normalizeActivity(activity: any): CollectorActivity {
  const actionType = String(activity.actionType || "").toLowerCase();

  return {
    id: String(activity.id || crypto.randomUUID()),
    type:
      actionType === "watchlist"
        ? "watchlist"
        : actionType === "flagged"
        ? "flagged"
        : "portfolio",
    user: activity.username || "Unknown User",
    detail: activity.description || "Performed an activity",
    meta:
      activity.metadata?.price ||
      activity.metadata?.target ||
      activity.metadata?.value ||
      activity.cardId ||
      "",
    time: activity.createdAt || "",
  };
}

function MetricSkeleton() {
  return (
    <div className="min-w-[260px] md:min-w-0 bg-slate-900/60 border border-slate-800 rounded-[22px] p-6 animate-pulse">
      <div className="h-3 w-32 bg-slate-800 rounded-full mb-4" />
      <div className="h-8 w-28 bg-slate-800 rounded-full mb-6" />
      <div className="h-4 w-24 bg-slate-800 rounded-full" />
    </div>
  );
}

export default function AdminDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState<any>(defaultMetrics);
  const [engagement, setEngagement] = useState<any>(defaultEngagement);
  const [qa, setQa] = useState<any>(defaultQa);
  const [activities, setActivities] = useState<CollectorActivity[]>([]);

  async function loadDashboard() {
    try {
      setIsRefreshing(true);

      const res = await getAdminDashboard();

      if (res?.success) {
        setMetrics(res.metrics || defaultMetrics);
        setEngagement(res.engagement || defaultEngagement);
        setQa(res.qa || defaultQa);

        setActivities(
          Array.isArray(res.activities)
            ? res.activities.map(normalizeActivity)
            : []
        );
      } else {
        console.warn("Admin dashboard warning:", res?.message);
      }
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const coreMetrics = [
    {
      label: "Total Cards Ingested",
      value: metrics.totalCardsLabel || "0",
      sub: "cmc_cards",
      icon: Database,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      label: "Total Expansions",
      value: metrics.totalExpansionsLabel || "0",
      sub: "cmc_expansions",
      icon: Layers,
      color: "text-purple-600 bg-purple-500/10",
    },
    {
      label: "Frontend Display Cards",
      value: metrics.frontendCardsLabel || "0",
      sub: "cmc_card_frontend",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Total Digital Assets",
      value: metrics.assetsLabel || "0",
      sub: "Images & Symbols",
      icon: ImageIcon,
      color: "text-amber-600 bg-amber-500/10",
    },
  ];

  return (
    <div className="bg-[#FAFAFB] dark:bg-slate-950 min-h-screen font-sans w-full space-y-8 pb-20 md:pb-0">
      <DashboardHeader
        isRefreshing={isRefreshing}
        onRefresh={loadDashboard}
      />

      <div className="w-full">
        <div className="flex md:grid md:grid-cols-4 overflow-x-auto md:overflow-x-visible gap-5 items-stretch scrollbar-hide">
          {loading
            ? [0, 1, 2, 3].map((item) => <MetricSkeleton key={item} />)
            : coreMetrics.map((metric, i) => (
                <MetricCard key={metric.label} index={i} {...metric} />
              ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UserEngagementMetrics data={engagement} />

          <QaIntegrityReport alerts={Array.isArray(qa.alerts) ? qa.alerts : []} />
        </div>

        <div className="space-y-6">
          <UserActivityOversight
            activities={activities}
            totalWatchlists={Number(metrics.totalWatchlists || 0)}
          />
        </div>
      </div>
    </div>
  );
}