export async function fetchUniversalSearch(q: string, game: string | null = null, limit = 20) {
  try {
    // 1. Clean the query: trim whitespace to prevent empty tokens in PHP
    const cleanQuery = q.trim();

    if (!cleanQuery) return [];

    const params = new URLSearchParams({
      q: cleanQuery,
      limit: limit.toString()
    });
    
    if (game && game !== 'all') {
      params.append('game', game);
    }

    // 2. Fetch from your updated PHP script
    const response = await fetch(
      `https://pokecollectorhub.com/api/cmc_universal_search.php?${params.toString()}`, 
      {
        next: { revalidate: 60 } // Cache results for 1 minute
      }
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();

    // 3. Return the results array from the PHP response
    return data.results || [];
    
  } catch (error) {
    console.error("PHP Search Fetch Error:", error);
    return [];
  }
}