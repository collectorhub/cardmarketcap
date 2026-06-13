"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getUserActivities(userId: number, limit = 5) {
  if (!userId || userId <= 0) {
    return {
      success: false,
      activities: [],
      message: "Invalid user ID.",
    };
  }

  try {
    const response = await fetch(
      `${API_BASE}/get_user_activities.php?userId=${userId}&limit=${limit}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        next: { tags: ["activities"] },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        activities: [],
        message: data.message || "Failed to fetch activities.",
      };
    }

    return {
      success: true,
      activities: Array.isArray(data.activities) ? data.activities : [],
    };
  } catch (error) {
    console.error("Fetch Activities Error:", error);

    return {
      success: false,
      activities: [],
      message: "Could not connect to activities endpoint.",
    };
  }
}