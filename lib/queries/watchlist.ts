"use server";

import { revalidateTag } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addCardToWatchlist(formData: {
  user_id: number;
  card_id: string;
  grade: string;
}) {
  console.log("Adding to Watchlist for User ID:", formData.user_id);

  if (!formData.user_id || formData.user_id === 0) {
    return {
      success: false,
      message: "Authentication Error: Please sign in to watch cards.",
    };
  }

  try {
    const phpRes = await fetch(`${API_BASE}/save_to_watchlist.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    const data = await phpRes.json();

    if (!phpRes.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Backend server error",
      };
    }

    revalidateTag("watchlist");
    revalidateTag("activities");

    return data;
  } catch (error) {
    console.error("Watchlist Action Error:", error);

    return {
      success: false,
      message: "Network error: API unreachable",
    };
  }
}

export async function getWatchlist(userId: number) {
  if (!userId || userId <= 0) {
    return {
      success: false,
      message: "No valid User ID provided.",
      data: null,
    };
  }

  try {
    const response = await fetch(`${API_BASE}/watchlist.php?userId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      next: { tags: ["watchlist"] },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch watchlist.",
        data: null,
      };
    }

    const watchlist = data.watchlist || {};

    return {
      success: true,
      userId: data.userId || userId,
      data: {
        totalValue: Number(watchlist.totalValue || 0),
        totalCards: Number(watchlist.totalCards || 0),
        setCount: Number(watchlist.setCount || 0),

        cards: Array.isArray(watchlist.cards) ? watchlist.cards : [],
        allocation: Array.isArray(watchlist.allocation) ? watchlist.allocation : [],

        growth7D: Number(watchlist.growth7D || 0),
        growth30D: Number(watchlist.growth30D || 0),
        growth90D: Number(watchlist.growth90D || 0),
        growthAll: Number(watchlist.growthAll || 0),

        change7DValue: Number(watchlist.change7DValue || 0),
        change30DValue: Number(watchlist.change30DValue || 0),
        change90DValue: Number(watchlist.change90DValue || 0),
        changeAllValue: Number(watchlist.changeAllValue || 0),

        activeAlerts: Number(watchlist.activeAlerts || 0),
        avgDailyChange: Number(watchlist.avgDailyChange || 0),

        meta: watchlist.meta || {
          createdAt: null,
          initialValue: 0,
          totalIncrease: 0,
          totalIncreasePercent: 0,
        },
      },
    };
  } catch (error) {
    console.error("Fetch Watchlist Error:", error);

    return {
      success: false,
      message: "Connection failed. Please check your internet or API status.",
      data: null,
    };
  }
}