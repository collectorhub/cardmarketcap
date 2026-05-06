const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetches PSA Population data for a specific card.
 * Maps 'grade_X' keys from the DB to 'psaX' for the UI.
 */
export async function fetchPsaPopById(id: string) {
  if (!id) return null;

  try {
    const response = await fetch(`${API_BASE}/psa_data.php?id=${encodeURIComponent(id)}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`PSA API responded with status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      console.warn(`No PSA data found for card ID: ${id}`);
      return null;
    }

    // The PHP script already formats the keys as psa1, psa2, etc.
    // We return the data object directly to be consumed by the CardDetails component.
    return {
      psa1: result.data.psa1 || 0,
      psa2: result.data.psa2 || 0,
      psa3: result.data.psa3 || 0,
      psa4: result.data.psa4 || 0,
      psa5: result.data.psa5 || 0,
      psa6: result.data.psa6 || 0,
      psa7: result.data.psa7 || 0,
      psa8: result.data.psa8 || 0,
      psa9: result.data.psa9 || 0,
      psa10: result.data.psa10 || 0,
      total: result.data.total || 0
    };

  } catch (error) {
    console.error("⚠️ PSA Pop Fetch Error:", error);
    return null; // Return null so the UI can show "Data Unavailable" gracefully
  }
}