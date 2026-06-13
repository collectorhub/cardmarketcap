"use server";

import { revalidateTag } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addCardToPortfolio(formData: {
  user_id: number;
  card_id: string;
  grade: string;
}) {
  console.log("Attempting to save for User ID:", formData.user_id);

  if (!formData.user_id || formData.user_id === 0) {
    return { 
      success: false, 
      message: `Auth Error: Received User ID (${formData.user_id}). Please re-login.` 
    };
  }

  try {
    const phpRes = await fetch(`${API_BASE}/save_to_portfolio.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    const data = await phpRes.json();

    if (!phpRes.ok) {
      return { success: false, message: data.message || "Server Error" };
    }

    revalidateTag("portfolio");
    revalidateTag("activities");

    return data;
  } catch (error) {
    console.error("Portfolio Action Error:", error);
    return { success: false, message: "Network error: Could not reach server" };
  }
}

export async function getPortfolio(userId: number) {
  try {
    if (!userId || userId === 0) {
      return { success: false, message: "Invalid or missing User ID." };
    }

    const response = await fetch(`${API_BASE}/portfolio.php?userId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      next: { tags: ["portfolio"] },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      return { 
        success: false, 
        message: data.message || "Failed to fetch portfolio." 
      };
    }

    return {
      success: true,
      data: data,
    };

  } catch (error) {
    console.error("Fetch Portfolio Error:", error);
    return { 
      success: false, 
      message: "Could not connect to the server. Please try again later." 
    };
  }
}