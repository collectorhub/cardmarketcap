const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCardUserStatus(userId: number, cardId: string) {
  try {
    const res = await fetch(
      `${API_BASE}/card_user_status.php?userId=${userId}&cardId=${encodeURIComponent(cardId)}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    return {
      success: !!data.success,
      portfolioGrades: data.portfolioGrades || [],
      watchlistGrades: data.watchlistGrades || [],
    };
  } catch (error) {
    return {
      success: false,
      portfolioGrades: [],
      watchlistGrades: [],
    };
  }
}