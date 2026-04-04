export async function fetchMarketStats() {
  try {
    const response = await fetch('https://pokecollectorhub.com/api/market_stats.php', {
      next: { revalidate: 300 } // Cache for 5 minutes to protect the server
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { sentimentScore: 50, stats: [] }; // Safe fallback
  }
}

export async function fetchTrendingCards() {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000); // 8 second timeout limit

  try {
    const response = await fetch('https://pokecollectorhub.com/api/top_trending_cards.php', {
      signal: controller.signal,
      next: { revalidate: 300 }
    });

    clearTimeout(id);

    if (!response.ok) return [];
    
    const data = await response.json();
    
    // Safety check: ensure data is an array
    if (!Array.isArray(data)) return [];

    return data.map((card: any) => ({
      id: card.id,
      name: card.name,
      set: "Base Set",
      price: `$${card.price.toLocaleString()}`,
      h24: `+${card.change_24h}%`,
      score: 95,
      type: "Modern",
      grade: "Raw",
      image: card.image_url || "https://images.pokemontcg.io/base1/4_hires.png"
    }));
  } catch (error) {
    console.error("⚠️ Trending Fetch Error (Timeout or Reset):", error);
    return []; // Return empty array so the UI doesn't crash
  }
}

export async function fetchCMCCards(
  page = 1, 
  search = "", 
  sort = "top", 
  category = "all", 
  grade = "psa 10"
) {
  try {
    // Construct the URL with all the new filter parameters
    const baseUrl = `https://pokecollectorhub.com/api/cmc_cards.php`;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      search: search,
      sort: sort,
      category: category,
      grade: grade
    });

    const response = await fetch(`${baseUrl}?${queryParams.toString()}`);

    if (!response.ok) {
      console.error("API Response Error:", response.statusText);
      return { data: [], metadata: { total_records: 0, total_pages: 0, current_page: 1 } };
    }
    
    const result = await response.json();

    // Safety check for successful response
    if (!result.success) {
      return { data: [], metadata: result.metadata || {} };
    }

    const formattedData = result.data.map((card: any) => ({
      ...card,
      // Map imageUrl to image for the UI components
      image: card.imageUrl || "https://images.pokemontcg.io/base1/4_hires.png",
      // Ensure numbers are actual numbers for frontend sorting/math if needed
      popTotalNum: parseInt(card.popTotal.replace(/,/g, '')),
      gradeCountNum: parseInt(card.gradeCount.replace(/,/g, ''))
    }));

    return { data: formattedData, metadata: result.metadata };
  } catch (error) {
    console.error("Fetch error:", error);
    return { data: [], metadata: { total_records: 0, total_pages: 0, current_page: 1 } };
  }
}