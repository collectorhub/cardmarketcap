
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Fetches PSA Population data for a specific card ID
 * @param id The CMC Card ID (e.g., swshp-SWSH262)
 */
export async function fetchPopData(id: string) {
  try {
    const response = await fetch(`${API_BASE}/pop_data.php?id=${id}`, {
      next: { revalidate: 3600 } // Cache pop data for 1 hour
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching population data:", error);
    return null;
  }
}