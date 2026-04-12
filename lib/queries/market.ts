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
      search: search || "",
      sort: sort || "top",
      category: category || "all",
      grade: grade || "psa 10"
    });

    const response = await fetch(`${baseUrl}?${queryParams.toString()}`, {
      next: { revalidate: 60, tags: ['cards'] } 
    });

    if (!response.ok) return { data: [], metadata: { total_records: 0, total_pages: 0, current_page: 1 } };
    
    const result = await response.json();
    if (!result.success) return { data: [], metadata: result.metadata || {} };

    const formattedData = result.data.map((card: any) => ({
      ...card,
      image: card.imageUrl || "https://pokecollectorhub.com/assets/placeholder.png",
      
      // EXPLICIT RARITY FETCHING
      rarity: card.rarity || card.type || "Standard", 
      
      // EXPANSION ASSETS
      setLogo: card.setLogo || null,
      setSymbol: card.setSymbol || null,

      // NUMBER PARSING
      priceNum: parseFloat(card.price?.replace(/[$,]/g, '') || "0"),
      popTotalNum: parseInt(card.popTotal?.replace(/,/g, '') || "0"),
      gradeCountNum: parseInt(card.gradeCount?.replace(/,/g, '') || "0"),
      marketCapNum: parseFloat(card.marketCap?.replace(/[$,M]/g, '') || "0")
    }));

    return { data: formattedData, metadata: result.metadata };
  } catch (error) {
    console.error("Fetch error:", error);
    return { data: [], metadata: { total_records: 0, total_pages: 0, current_page: 1 } };
  }
}

export async function fetchCardById(id: string) {
  try {
    const cmcResponse = await fetch(`https://pokecollectorhub.com/api/cmc_cards.php?search=${id}`, {
      next: { revalidate: 60 } 
    });

    if (cmcResponse.ok) {
      const cmcResult = await cmcResponse.json();
      if (cmcResult.success && cmcResult.data?.length > 0) {
        const found = cmcResult.data.find((c: any) => String(c.id) === id);
        if (found) {
           return {
             ...found,
             rarity: found.rarity || found.type || "Standard", // Pass rarity to detail page
             setLogo: found.setLogo,
             setSymbol: found.setSymbol,
             priceNum: parseFloat(found.price?.replace(/[$,]/g, '') || "0"),
             image: found.imageUrl
           };
        }
      }
    }

    // 2. Fallback to Trending (if primary source fails)
    const trendingCards = await fetchTrendingCards();
    const trendingMatch = trendingCards.find(c => String(c.id) === id);

    if (trendingMatch) {
      return {
        id: trendingMatch.id,
        name: trendingMatch.name,
        imageUrl: trendingMatch.image,
        image: trendingMatch.image, 
        priceNum: parseFloat(trendingMatch.price?.replace(/[$,]/g, '') || "0"),
        price: trendingMatch.price,
        set: trendingMatch.set,
        set_name: trendingMatch.set,
        rarity: "Trending",
        grade: trendingMatch.grade || "Raw",
        // Note: Fallback likely won't have these URLs unless trending API is also updated
        setLogo: null,
        setSymbol: null
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in unified fetchCardById:", error);
    return null;
  }
}

export async function fetchExpansions() {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch('https://pokecollectorhub.com/api/sets.php', {
      signal: controller.signal,
      next: { revalidate: 3600 } // Sets don't change often, cache for 1 hour
    });

    clearTimeout(id);

    if (!response.ok) return { success: false, count: 0, data: [] };

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      return { success: false, count: 0, data: [] };
    }

    // Map the data to ensure consistency with your SetCard component needs
    const formattedData = result.data.map((set: any) => ({
      ...set,
      // Ensure numeric values for potential sorting/filtering in the UI
      totalCardsNum: parseInt(set.totalCards) || 0,
      marketCapNum: parseFloat(set.marketCap?.replace(/[$,M]/g, '') || "0"),
      // Fallback for missing logos
      logoUrl: set.logoUrl || "https://pokecollectorhub.com/assets/placeholder-logo.png",
      // Adding era grouping logic if needed by the frontend tabs (Modern/Vintage)
      era: (new Date(set.releaseDate).getFullYear() < 2011) ? "Vintage" : "Modern"
    }));

    return {
      success: true,
      count: result.count,
      data: formattedData
    };
  } catch (error) {
    console.error("⚠️ Expansions Fetch Error:", error);
    return { success: false, count: 0, data: [] }; // Safe fallback for the UI
  }
}