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
    const baseUrl = `https://pokecollectorhub.com/api/cmc_cards.php`;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      search: search || "",     // Ensure it's never undefined
      sort: sort || "top",
      category: category || "all",
      grade: grade || "psa 10"
    });

    // Add a cache tag so you can revalidate this specific data later
    const response = await fetch(`${baseUrl}?${queryParams.toString()}`, {
      next: { revalidate: 60, tags: ['cards'] } 
    });

    if (!response.ok) return { data: [], metadata: { total_records: 0, total_pages: 0, current_page: 1 } };
    
    const result = await response.json();
    if (!result.success) return { data: [], metadata: result.metadata || {} };

    const formattedData = result.data.map((card: any) => ({
      ...card,
      // Priority 1: imageUrl from API, Priority 2: placeholder
      image: card.imageUrl || "https://pokecollectorhub.com/assets/placeholder.png",
      // Convert formatted strings ("1,200") back to numbers for the UI to use in math
      popTotalNum: parseInt(card.popTotal?.replace(/,/g, '') || "0"),
      gradeCountNum: parseInt(card.gradeCount?.replace(/,/g, '') || "0")
    }));

    return { data: formattedData, metadata: result.metadata };
  } catch (error) {
    console.error("Fetch error:", error);
    return { data: [], metadata: { total_records: 0, total_pages: 0, current_page: 1 } };
  }
}

export async function fetchCardById(id: string) {
  try {
    // 1. Try fetching from CMC Cards first (Primary Source)
    const cmcResponse = await fetch(`https://pokecollectorhub.com/api/cmc_cards.php?search=${id}`, {
      next: { revalidate: 60 } 
    });

    if (cmcResponse.ok) {
      const cmcResult = await cmcResponse.json();
      if (cmcResult.success && cmcResult.data?.length > 0) {
        const found = cmcResult.data.find((c: any) => String(c.id) === id);
        if (found) return found;
      }
    }

    // 2. Fallback: Check Trending Cards if not found in CMC
    // Since trending IDs (like 12931) might not be in the CMC search
    const trendingCards = await fetchTrendingCards();
    const trendingMatch = trendingCards.find(c => String(c.id) === id);

    if (trendingMatch) {
      // Map trending format to your Detail Page format
      return {
        id: trendingMatch.id,
        name: trendingMatch.name,
        imageUrl: trendingMatch.image,
        marketPrice: parseFloat(trendingMatch.price.replace('$', '').replace(',', '')),
        // Add other default fields your Detail UI expects
        set_name: trendingMatch.set,
        rarity: "Trending",
        grade: trendingMatch.grade
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in unified fetchCardById:", error);
    return null;
  }
}