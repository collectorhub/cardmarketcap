"use server"; // Mark this as a Server Action

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addCardToPortfolio(formData: {
  user_id: number;
  card_id: string;
  grade: string;
}) {
  try {
    const phpRes = await fetch(`${API_BASE}/save_to_portfolio.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      cache: 'no-store', // Ensure we always get fresh data
    });

    if (!phpRes.ok) {
      throw new Error(`Backend responded with ${phpRes.status}`);
    }

    return await phpRes.json();
  } catch (error) {
    console.error("Portfolio Action Error:", error);
    return { success: false, message: "Failed to connect to database" };
  }
}