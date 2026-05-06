"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addCardToPortfolio(formData: {
  user_id: number;
  card_id: string;
  grade: string;
}) {
  // Detailed log for debugging (check your terminal, not browser console)
  console.log("Attempting to save for User ID:", formData.user_id);

  if (!formData.user_id || formData.user_id === 0) {
    return { 
      success: false, 
      message: `Auth Error: Received User ID (${formData.user_id}). Please re-login.` 
    };
  }

  try {
    const phpRes = await fetch(`${API_BASE}/save_to_portfolio.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      cache: 'no-store',
    });

    const data = await phpRes.json();

    if (!phpRes.ok) {
      return { success: false, message: data.message || "Server Error" };
    }

    return data;
  } catch (error) {
    console.error("Portfolio Action Error:", error);
    return { success: false, message: "Network error: Could not reach server" };
  }
}

export async function getWatchlist(userId: number) {
  try {
    // We use a query parameter for the GET request
    const response = await fetch(`${API_BASE}/watchlist.php?userId=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // 'no-store' ensures we always get the latest data from the DB
      cache: 'no-store', 
      // Optional: use tags if you want to use revalidateTag() later
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
      data: data.watchlist // Returns the object containing totalValue, cards, allocation, etc.
    };

  } catch (error) {
    console.error("Fetch Watchlist Error:", error);
    return { 
      success: false, 
      message: "Could not connect to the server. Please try again later." 
    };
  }
}