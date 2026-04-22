export async function fetchUniversalSearch(q: string, game: string | null = null, limit = 20) {
  try {
    const params = new URLSearchParams({
      q: q,
      limit: limit.toString()
    });
    
    if (game) params.append('game', game);

    // Using your PHP script directly
    const response = await fetch(`https://pokecollectorhub.com/api/cmc_universal_search.php?${params.toString()}`);
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("PHP Search Fetch Error:", error);
    return [];
  }
}