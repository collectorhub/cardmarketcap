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

export async function fetchCMCCards(page = 1) {
  try {
    const response = await fetch(`https://pokecollectorhub.com/api/cmc_cards.php?page=${page}`);
    if (!response.ok) return { data: [], metadata: {} };
    
    const result = await response.json();

    // Map the data to ensure every card has a valid 'image' property
    const formattedData = result.data.map((card: any) => ({
      ...card,
      // Use the API's imageUrl, but if it fails, the <img> tag will handle the rest
      image: card.imageUrl || "https://images.pokemontcg.io/base1/4_hires.png"
    }));

    return { data: formattedData, metadata: result.metadata };
  } catch (error) {
    console.error("Fetch error:", error);
    return { data: [], metadata: {} };
  }
}