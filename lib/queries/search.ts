"use server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchUniversalSearch(q: string, game: string | null = null, limit = 20) {
  try {
    const cleanQuery = q.trim();

    // CHANGE: Allow the search if a game is selected, even if cleanQuery is empty
    if (!cleanQuery && (!game || game === 'all')) {
        return [];
    }

    const params = new URLSearchParams({
      q: cleanQuery, // PHP handles empty q fine
      limit: limit.toString()
    });
    
    if (game && game !== 'all') {
      params.append('game', game);
    }

    const response = await fetch(
      `${API_BASE}/cmc_universal_search.php?${params.toString()}`, 
      {
        next: { revalidate: 60 } 
      }
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.results || [];
    
  } catch (error) {
    console.error("PHP Search Fetch Error:", error);
    return [];
  }
}