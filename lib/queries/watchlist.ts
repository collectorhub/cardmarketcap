"use server";

import { revalidateTag } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * ADDS A CARD TO THE USER'S WATCHLIST
 * Points to the new save_to_watchlist.php endpoint
 */
export async function addCardToWatchlist(formData: {
  user_id: number;
  card_id: string;
  grade: string;
}) {
  // Debugging log for server-side terminal
  console.log("Adding to Watchlist for User ID:", formData.user_id);

  if (!formData.user_id || formData.user_id === 0) {
    return { 
      success: false, 
      message: "Authentication Error: Please sign in to watch cards." 
    };
  }

  try {
    const phpRes = await fetch(`${API_BASE}/save_to_watchlist.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      cache: 'no-store',
    });

    const data = await phpRes.json();

    if (!phpRes.ok) {
      return { success: false, message: data.message || "Backend server error" };
    }

    // Trigger a refresh of any components using the 'watchlist' tag
    revalidateTag('watchlist');

    return data;
  } catch (error) {
    console.error("Watchlist Action Error:", error);
    return { success: false, message: "Network error: API unreachable" };
  }
}

/**
 * FETCHES THE USER'S WATCHLIST DATA
 * Points to the updated watchlist.php endpoint
 */
export async function getWatchlist(userId: number) {
  if (!userId || userId === 0) {
    return { success: false, message: "No valid User ID provided." };
  }

  try {
    const response = await fetch(`${API_BASE}/watchlist.php?userId=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', 
      next: { tags: ['watchlist'] } 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!data.success) {
      return { 
        success: false, 
        message: data.message || "Failed to fetch watchlist." 
      };
    }

    return {
      success: true,
      data: data.watchlist // Returns: { totalValue, cards, allocation, setCount, etc. }
    };

  } catch (error) {
    console.error("Fetch Watchlist Error:", error);
    return { 
      success: false, 
      message: "Connection failed. Please check your internet or API status." 
    };
  }
}