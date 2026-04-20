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

export async function fetchExpansions(
  game = "pokemon", 
  search = "", 
  page = 1
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000);

  try {
    const baseUrl = 'https://pokecollectorhub.com/api/cmc_expansions.php';
    const queryParams = new URLSearchParams({
      game: game,
      search: search,
      page: page.toString(),
      limit: "1000" // Fetch everything to allow instant local filtering
    });

    const response = await fetch(`${baseUrl}?${queryParams.toString()}`, {
      signal: controller.signal,
      next: { revalidate: 3600 } 
    });

    clearTimeout(id);

    if (!response.ok) return { success: false, data: [] };
    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      return { success: false, data: [] };
    }

    const formattedData = result.data.map((set: any) => ({
      ...set,
      totalCards: parseInt(set.totalCards) || 0,
      logoUrl: set.logoUrl || "https://pokecollectorhub.com/assets/placeholder-set.png",
      floorPrice: set.floorPrice || "$0.00",
      change: set.change || "0.00%",
      language: set.language // Keep the 'en' or 'ja' from the DB
    }));

    return {
      success: true,
      data: formattedData,
      metadata: result.metadata
    };
  } catch (error) {
    console.error("⚠️ Expansions Fetch Error:", error);
    return { success: false, data: [] }; 
  }
}

export async function fetchSetDetails(setId: string) {
  try {
    const expResponse = await fetch(`https://pokecollectorhub.com/api/cmc_expansions.php`);
    const expResult = await expResponse.json();
    const decodedId = decodeURIComponent(setId);
    const targetSet = expResult.data?.find((s: any) => s.id === decodedId);

    if (!targetSet) return { success: false, set: null, assets: [] };

    // Fetch cards for this set
    const cardsResponse = await fetch(
      `https://pokecollectorhub.com/api/cmc_cards.php?set=${encodeURIComponent(targetSet.name)}&limit=500`
    );
    let cardsResult = await cardsResponse.json();

    // Fallback if name search fails
    if (!cardsResult.data || cardsResult.data.length === 0) {
      const fallbackResponse = await fetch(
        `https://pokecollectorhub.com/api/cmc_cards.php?expansion_id=${encodeURIComponent(decodedId)}&limit=500`
      );
      cardsResult = await fallbackResponse.json();
    }

    const setInfo = {
      id: decodedId,
      name: targetSet.name,
      series: targetSet.series || "Standard",
      releaseDate: targetSet.releaseDate,
      totalCards: targetSet.totalCards || cardsResult.data?.length || 0,
      logoUrl: targetSet.logoUrl,
      marketCap: targetSet.floorPrice || "$0.00"
    };

    // MAP DATA HERE: Crucial for the AssetCard to have the canonicalUrl
    const formattedAssets = (cardsResult.data || []).map((card: any) => ({
      ...card,
      id: card.id,
      name: card.name,
      imageUrl: card.imageUrl || "https://pokecollectorhub.com/assets/placeholder.png",
      price: card.price || "$0.00",
      canonicalUrl: card.canonicalUrl // Passed from PHP API
    }));

    return {
      success: true,
      set: setInfo,
      assets: formattedAssets
    };

  } catch (error) {
    console.error("fetchSetDetails Error:", error);
    return { success: false, set: null, assets: [] };
  }
}

// Add this alongside your existing fetchExpansions function
export async function fetchExpansionDetails(setId: string) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000);

  try {
    // Note: Adjust the URL if your PHP API uses a different endpoint for single sets
    // e.g., 'https://pokecollectorhub.com/api/set-details.php?id='
    const response = await fetch(`https://pokecollectorhub.com/api/sets.php?id=${setId}`, {
      signal: controller.signal,
      next: { revalidate: 3600 } 
    });

    clearTimeout(id);

    if (!response.ok) return { success: false, data: null };

    const result = await response.json();

    if (!result.success || !result.data) {
      return { success: false, data: null };
    }

    // Ensure the data structure matches what SetDetailsPage expects
    const formattedData = {
      ...result.data,
      logoUrl: result.data.logoUrl || "https://pokecollectorhub.com/assets/placeholder-logo.png",
      cards: result.data.cards || [] // Ensure cards array exists
    };

    return {
      success: true,
      data: formattedData
    };
  } catch (error) {
    console.error(`⚠️ Set Details Fetch Error (${setId}):`, error);
    return { success: false, data: null };
  }
}