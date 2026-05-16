import { fetchPopData } from "./pop";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function fetchMarketStats() {
  try {
    const response = await fetch(`${API_BASE}/market_stats.php`, {
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
    const response = await fetch(`${API_BASE}/top_trending_cards.php`, {
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
  grade = "psa 10",
  game = "pokemon" // Added game parameter
) {
  try {
    const baseUrl = `${API_BASE}/cmc_cards.php`;
    const queryParams = new URLSearchParams({
      game: game, // Pass the game to PHP
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
      
      // ✨ Normalizing routing variations securely:
      canonicalUrl: card.canonical_path || card.canonicalUrl || card.url || "",
      
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

export async function fetchCardByCanonicalUrl(canonicalPath: string, game: string = "pokemon") {
  try {
    let normalizedGame = game.toLowerCase();
    if (normalizedGame === "magic") normalizedGame = "mtg";

    // 1. QUERY CMC_ASSETS VIA EXACT PATH 
    const assetResponse = await fetch(
      `${API_BASE}/cmc_universal_search.php?q=${encodeURIComponent(canonicalPath)}&game=${normalizedGame}&limit=1`,
      { next: { revalidate: 60 } }
    );

    if (assetResponse.ok) {
      const assetJson = await assetResponse.json();
      if (assetJson.success && assetJson.results?.length > 0) {
        const assetMatch = assetJson.results[0];
        return {
          id: assetMatch.id,
          source_id: assetMatch.id,
          name: assetMatch.name,
          game: assetMatch.game,
          set_name: assetMatch.set,
          expansion_name: assetMatch.set,
          number: assetMatch.number,
          image: assetMatch.imageUrl,
          imageUrl: assetMatch.imageUrl,
          canonical_path: assetMatch.url,
          rarity: "Standard",
          priceNum: 0,
          price: "$0.00"
        };
      }
    }

    // 2. FALLBACK: QUERY CMC_CARDS VIA EXACT PATH
    const cmcResponse = await fetch(
      `${API_BASE}/cmc_cards.php?search=${encodeURIComponent(canonicalPath)}&game=${normalizedGame}&limit=1`,
      { next: { revalidate: 60 } }
    );

    if (cmcResponse.ok) {
      const cmcJson = await cmcResponse.json();
      if (cmcJson.success && cmcJson.data?.length > 0) {
        const frontendMatch = cmcJson.data[0];
        return {
          ...frontendMatch,
          rarity: frontendMatch.rarity || frontendMatch.type || "Standard",
          priceNum: parseFloat(String(frontendMatch.price || "0").replace(/[$,]/g, '') || "0"),
          image: frontendMatch.imageUrl || frontendMatch.image_small,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching card by canonical URL:", error);
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
    const baseUrl = `${API_BASE}/cmc_expansions.php`;
    const queryParams = new URLSearchParams({
      game: game,
      search: search,
      page: page.toString(),
      limit: "2000" // Fetch everything to allow instant local filtering
    });

    const response = await fetch(`${baseUrl}?${queryParams.toString()}`, {
      signal: controller.signal,
      next: { revalidate: 60 } 
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

function getGameFromSetId(setId: string): string {
  const id = setId.toUpperCase();

  // 1. ONE PIECE: Detects codes like OP01, EB01, ST01, PRB01, or P
  if (/^(OP|EB|ST|PRB)\d+/.test(id) || id === 'P') {
    return 'onepiece';
  }

  // 2. LORCANA: Detects all known Lorcana codes
  const lorcanaCodes = [
    'TFC', 'ROTF', 'ITI', 'UR', 'Q1', 'D100', 'C1', 'D23C24', 
    'P2', 'SS', 'AZS', 'ARI', 'ROJ', 'FBL', 'P3', 'C2', 'WITW', 'WNTR'
  ];
  if (lorcanaCodes.includes(id) || id.startsWith('LOR')) {
    return 'lorcana';
  }

  // 3. MAGIC: Only return 'mtg' if it explicitly contains the tag
  // Removed "id.length === 3" to prevent 'me3' or 'sv1' from being caught
  if (id.includes('MTG')) {
    return 'mtg';
  }

  // 4. POKEMON: Default fallback
  return 'pokemon';
}

export async function fetchSetDetails(setId: string) {
  try {
    const decodedId = decodeURIComponent(setId);
    const game = getGameFromSetId(decodedId);
    
    // 1. Fetch expansion metadata
    const expResponse = await fetch(`${API_BASE}/cmc_expansions.php?game=${game}`, {
      next: { revalidate: 60 }
    });
    const expResult = await expResponse.json();
    
    const targetSet = expResult.data?.find((s: any) => 
      s.id.toLowerCase() === decodedId.toLowerCase()
    );

    if (!targetSet) {
      console.warn(`Set ${decodedId} not found.`);
      return { success: false, set: null, assets: [] };
    }

    // 2. Fetch cards for this expansion
    const cardsResponse = await fetch(
      `${API_BASE}/cmc_cards.php?game=${game}&expansion_id=${encodeURIComponent(targetSet.id)}&limit=500`,
      { next: { revalidate: 60 } }
    );
    let cardsResult = await cardsResponse.json();

    // Fallback: Try searching by Set Name if ID search returns empty
    if (!cardsResult.data || cardsResult.data.length === 0) {
      const nameResponse = await fetch(
        `${API_BASE}/cmc_cards.php?game=${game}&set=${encodeURIComponent(targetSet.name)}&limit=500`
      );
      cardsResult = await nameResponse.json();
    }

    const setInfo = {
      id: targetSet.id,
      name: targetSet.name,
      series: targetSet.series || (game === 'pokemon' ? 'Pokémon' : game),
      releaseDate: targetSet.releaseDate,
      totalCards: targetSet.totalCards || cardsResult.data?.length || 0,
      logoUrl: targetSet.logoUrl || "https://pokecollectorhub.com/assets/placeholder-set.png",
      marketCap: targetSet.floorPrice || "$0.00"
    };

   const formattedAssets = (cardsResult.data || []).map((card: any) => {
  const imageCandidates = [
    card.largeImage,
    card.imageUrl,
    card.image_url,
    card.image,
  ];

  const validImage = imageCandidates.find(
    (url) =>
      typeof url === "string" &&
      url.trim() !== "" &&
      url.startsWith("http")
  );

  return {
    ...card,
    id: String(card.id),
    imageUrl:
      validImage ||
      "https://pokecollectorhub.com/assets/placeholder.png",
    price: card.price || "$0.00",
    rarity: card.rarity || card.type || "Standard",
    number: card.number || "000",
  };
});

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
    // e.g., '${API_BASE}/set-details.php?id='
    const response = await fetch(`${API_BASE}/sets.php?id=${setId}`, {
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