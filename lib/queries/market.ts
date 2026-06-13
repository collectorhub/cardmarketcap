// @/lib/queries/market.ts
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
      set: card.set || "Base Set",
      price: typeof card.price === "number" ? `$${card.price.toLocaleString()}` : card.price,
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
  game = "pokemon"
) {
  try {
    const baseUrl = `${API_BASE}/cmc_cards.php`;
    const queryParams = new URLSearchParams({
      game: game,
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
      
      // ✨ SAFELY CAPTURE CANONICAL ROUTE FROM THE UPDATED PHP PAYLOAD
      canonicalUrl: card.canonical_path || card.canonicalUrl || "",
      
      // EXPLICIT RARITY FETCHING
      rarity: card.rarity || card.type || "Standard", 
      
      // EXPANSION ASSETS
      setLogo: card.setLogo || null,
      setSymbol: card.setSymbol || null,

      // ✨ ROBUST NUMBER PARSING (Stripping commas globally from prices to handle values > $999.99)
      priceNum: parseFloat(String(card.price || "0").replace(/[$,]/g, '') || "0"),
      popTotalNum: parseInt(String(card.popTotal || "0").replace(/,/g, '') || "0"),
      gradeCountNum: parseInt(String(card.gradeCount || "0").replace(/,/g, '') || "0"),
      marketCapNum: parseFloat(String(card.marketCap || "0").replace(/[$,]/g, '') || "0"),
      
      // 📊 NEW TRANSACTION AND METRIC FIELD PARSING MAP
      sales30dNum: parseInt(String(card.sales30d || "0").replace(/,/g, '') || "0"),
      sales90dNum: parseInt(String(card.sales90d || "0").replace(/,/g, '') || "0"),
      avgPrice30dNum: parseFloat(String(card.avgPrice30d || "0").replace(/[$,]/g, '') || "0"),
      avgPrice90dNum: parseFloat(String(card.avgPrice90d || "0").replace(/[$,]/g, '') || "0"),
      liquidityScoreNum: parseFloat(String(card.liquidityScore || "0").replace(/,/g, '') || "0"),

      // Backward fallback structural fields matching old properties to keep your rendering intact
      change7dNum: parseFloat(String(card.change_7d || card.change || "0").replace(/[%\s]/g, '') || "0"),
      change30dNum: parseFloat(String(card.change_30d || "0").replace(/[%\s]/g, '') || "0"),

      // 🎯 FULL PSA POPULATION PASS THROUGH
      fullPsaPop: card.full_psa_pop || result.full_psa_pop || null
    }));

    // Note: result.metadata naturally contains the new set_summary object now
    return { data: formattedData, metadata: result.metadata };
  } catch (error) {
    console.error("Fetch error:", error);
    return { data: [], metadata: { total_records: 0, total_pages: 0, current_page: 1 } };
  }
}

export async function fetchCardById(id: string, game: string = "pokemon") {
  try {
    // 1. Fetch Population Data in parallel with the main card request for speed
    const popDataPromise = fetchPopData(id);

    // 2. Primary Fetch: Include the 'game' parameter
    const cmcResponse = await fetch(
      `${API_BASE}/cmc_cards.php?search=${id}&game=${game}`, 
      {
        next: { revalidate: 60 } 
      }
    );

    let cardResult: any = null;

    if (cmcResponse.ok) {
      const cmcJson = await cmcResponse.json();
      
      if (cmcJson.success && cmcJson.data?.length > 0) {
        const found = cmcJson.data.find((c: any) => String(c.id) === id);
        
        if (found) {
          const population = await popDataPromise;
          cardResult = {
            ...found,
            rarity: found.rarity || found.type || "Standard", 
            setLogo: found.setLogo,
            setSymbol: found.setSymbol,
            priceNum: parseFloat(found.price?.replace(/[$,]/g, '') || "0"),
            image: found.imageUrl,
            population: population || {} // Attach the pop data here
          };
        }
      }
    }

    // 3. Fallback to Trending if primary fetch failed
    if (!cardResult) {
      const trendingCards = await fetchTrendingCards();
      const trendingMatch = trendingCards.find(c => String(c.id) === id);

      if (trendingMatch) {
        const population = await popDataPromise;
        cardResult = {
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
          setLogo: null,
          setSymbol: null,
          population: population || {} // Also attach here
        };
      }
    }
    
    return cardResult;
  } catch (error) {
    console.error("Error in unified fetchCardById:", error);
    return null;
  }
}

export async function fetchCardByCanonicalUrl(
  canonicalPath: string,
  game: string = "pokemon",
  grade: string = "psa 10"
) {
  try {
    let normalizedGame = game.toLowerCase();
    if (normalizedGame === "magic") normalizedGame = "mtg";

    const cleanGrade = grade.toLowerCase().trim();

    // 1. PRIMARY: QUERY CMC_CARDS FIRST
    // This endpoint returns full_psa_pop + historical_sales for single-card views.
    const cardQueryParams = new URLSearchParams({
      search: canonicalPath,
      game: normalizedGame,
      grade: cleanGrade,
      limit: "1",
    });

    const cmcResponse = await fetch(
      `${API_BASE}/cmc_cards.php?${cardQueryParams.toString()}`,
      { next: { revalidate: 60 } }
    );

    if (cmcResponse.ok) {
      const cmcJson = await cmcResponse.json();

      if (cmcJson.success && cmcJson.data?.length > 0) {
        const frontendMatch = cmcJson.data[0];

        return {
          ...frontendMatch,

          id: frontendMatch.id,
          source_id: frontendMatch.id,
          game: cmcJson.metadata?.game || normalizedGame,

          set_name: frontendMatch.set,
          expansion_name: frontendMatch.set,
          set: frontendMatch.set || "Unknown Set",

          image: frontendMatch.imageUrl || frontendMatch.image_small,
          imageUrl: frontendMatch.imageUrl || frontendMatch.image_small,
          largeImage:
            frontendMatch.largeImage ||
            frontendMatch.imageUrl ||
            frontendMatch.image_small,

          canonicalUrl:
            frontendMatch.canonical_path ||
            frontendMatch.canonicalUrl ||
            "",
          canonical_path:
            frontendMatch.canonical_path ||
            frontendMatch.canonicalUrl ||
            "",

          rarity: frontendMatch.rarity || frontendMatch.type || "Standard",

          priceNum: parseFloat(
            String(frontendMatch.price || "0").replace(/[$,]/g, "") || "0"
          ),
          marketCapNum: parseFloat(
            String(frontendMatch.marketCap || "0").replace(/[$,]/g, "") || "0"
          ),
          popTotalNum: parseInt(
            String(frontendMatch.popTotal || "0").replace(/,/g, "") || "0",
            10
          ),
          gradeCountNum: parseInt(
            String(frontendMatch.gradeCount || "0").replace(/,/g, "") || "0",
            10
          ),
          psa10Num: parseInt(
            String(frontendMatch.psa10 || "0").replace(/,/g, "") || "0",
            10
          ),

          sales30dNum: parseInt(
            String(frontendMatch.sales30d || "0").replace(/,/g, "") || "0",
            10
          ),
          sales90dNum: parseInt(
            String(frontendMatch.sales90d || "0").replace(/,/g, "") || "0",
            10
          ),
          avgPrice30dNum: parseFloat(
            String(frontendMatch.avgPrice30d || "0").replace(/[$,]/g, "") ||
              "0"
          ),
          avgPrice90dNum: parseFloat(
            String(frontendMatch.avgPrice90d || "0").replace(/[$,]/g, "") ||
              "0"
          ),
          liquidityScoreNum: parseFloat(
            String(frontendMatch.liquidityScore || "0").replace(/,/g, "") ||
              "0"
          ),
          change7dNum: parseFloat(
            String(frontendMatch.change_7d || frontendMatch.change || "0").replace(
              /[%\s]/g,
              ""
            ) || "0"
          ),
          change30dNum: parseFloat(
            String(frontendMatch.change_30d || "0").replace(/[%\s]/g, "") ||
              "0"
          ),

          historicalSales: cmcJson.historical_sales || {},
          fullPsaPop:
            frontendMatch.full_psa_pop ||
            cmcJson.full_psa_pop ||
            null,
        };
      }
    }

    // 2. FALLBACK: Universal search if exact cmc_cards match fails.
    const assetResponse = await fetch(
      `${API_BASE}/cmc_universal_search.php?q=${encodeURIComponent(
        canonicalPath
      )}&game=${normalizedGame}&grade=${encodeURIComponent(cleanGrade)}&limit=1`,
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
          game: assetMatch.game || normalizedGame,
          set_name: assetMatch.set,
          expansion_name: assetMatch.set,
          set: assetMatch.set || "Unknown Set",
          number: assetMatch.number,
          image: assetMatch.imageUrl,
          imageUrl: assetMatch.imageUrl,
          largeImage: assetMatch.largeImage || assetMatch.imageUrl,
          canonical_path: assetMatch.url,
          canonicalUrl: assetMatch.url,
          rarity: assetMatch.rarity || "Standard",
          price: assetMatch.price || "$0.00",
          marketCap: assetMatch.marketCap || "$0.00",
          popTotal: assetMatch.popTotal || "0",
          gradeCount: assetMatch.gradeCount || "0",
          psa10: assetMatch.psa10 || "0",
          resolvedGrade:
            assetMatch.resolvedGrade ||
            `PSA ${cleanGrade.replace(/[^0-9]/g, "")}`,

          priceNum: parseFloat(
            String(assetMatch.price || "0").replace(/[$,]/g, "") || "0"
          ),
          marketCapNum: parseFloat(
            String(assetMatch.marketCap || "0").replace(/[$,]/g, "") || "0"
          ),
          popTotalNum: parseInt(
            String(assetMatch.popTotal || "0").replace(/,/g, "") || "0",
            10
          ),
          gradeCountNum: parseInt(
            String(assetMatch.gradeCount || "0").replace(/,/g, "") || "0",
            10
          ),
          sales30dNum: parseInt(
            String(assetMatch.sales30d || "0").replace(/,/g, "") || "0",
            10
          ),
          sales90dNum: parseInt(
            String(assetMatch.sales90d || "0").replace(/,/g, "") || "0",
            10
          ),
          avgPrice30dNum: parseFloat(
            String(assetMatch.avgPrice30d || "0").replace(/[$,]/g, "") || "0"
          ),
          avgPrice90dNum: parseFloat(
            String(assetMatch.avgPrice90d || "0").replace(/[$,]/g, "") || "0"
          ),
          liquidityScoreNum: parseFloat(
            String(assetMatch.liquidityScore || "0").replace(/,/g, "") || "0"
          ),
          change7dNum: parseFloat(
            String(assetMatch.change_7d || assetMatch.change || "0").replace(
              /[%\s]/g,
              ""
            ) || "0"
          ),
          change30dNum: parseFloat(
            String(assetMatch.change_30d || "0").replace(/[%\s]/g, "") || "0"
          ),

          historicalSales: assetJson.historical_sales || {},
          fullPsaPop:
            assetMatch.full_psa_pop ||
            assetJson.full_psa_pop ||
            null,
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
      limit: "1000" // Aligned with the php script maximum limits boundary cap
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
      language: set.language 
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
  if (/^(OP|EB|ST|PRB)\d+/.test(id) || id === 'P') return 'onepiece';
  const lorcanaCodes = ['TFC', 'ROTF', 'ITI', 'UR', 'Q1', 'D100', 'C1', 'D23C24', 'P2', 'SS', 'AZS', 'ARI', 'ROJ', 'FBL', 'P3', 'C2', 'WITW', 'WNTR'];
  if (lorcanaCodes.includes(id) || id.startsWith('LOR')) return 'lorcana';
  if (id.includes('MTG')) return 'mtg';
  return 'pokemon';
}

export async function fetchSetDetails(setId: string) {
  try {
    const decodedId = decodeURIComponent(setId).trim();

    if (!decodedId) {
      return {
        success: false,
        set: null,
        assets: [],
      };
    }

    const gamesToTry = ["pokemon", "mtg", "lorcana", "onepiece"];

    let result: any = null;
    let finalGame = "";

    for (const game of gamesToTry) {
      const url = `${API_BASE}/cmc_expansions.php?game=${game}&expansion_key=${encodeURIComponent(
        decodedId
      )}&limit=1000`;

      const response = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (!response.ok) continue;

      const json = await response.json();

      if (json?.success && json?.metadata?.expansion_key) {
        result = json;
        finalGame = json.metadata?.game || game;
        break;
      }
    }

    if (!result) {
      return {
        success: false,
        set: null,
        assets: [],
      };
    }

    const metadata = result.metadata || {};
    const rawAssetsArray = Array.isArray(result.data) ? result.data : [];

    const totalCardsCount =
      typeof metadata.total_records === "number"
        ? metadata.total_records
        : rawAssetsArray.length;

    const expansionName =
      metadata.expansion_name ||
      rawAssetsArray[0]?.set ||
      decodedId;

    const setInfo = {
      id: metadata.expansion_key || decodedId,
      requestedId: metadata.requested_expansion_key || decodedId,
      name: expansionName,
      series:
        finalGame === "pokemon"
          ? "Pokémon"
          : finalGame === "mtg"
          ? "Magic"
          : finalGame === "lorcana"
          ? "Disney Lorcana"
          : finalGame === "onepiece"
          ? "One Piece CG"
          : "Other",
      releaseDate: metadata.release_date || "",
      logoUrl:
        metadata.logo_url ||
        "https://pokecollectorhub.com/assets/placeholder-set.png",
      totalCards: totalCardsCount,
      marketCap: "$0.00",
      game: finalGame,
      metrics: null,
    };

    const formattedAssets = rawAssetsArray.map((card: any) => {
      const image =
        card.imageUrl ||
        card.image_url ||
        card.image ||
        card.image_small ||
        card.small_image ||
        card.large_image ||
        "https://pokecollectorhub.com/assets/placeholder.png";

      const priceString = card.price || "$0.00";

      return {
        ...card,

        id: String(card.id || card.card_slug || ""),
        name: card.name || "Unknown Card",
        game: card.game || finalGame,
        set: card.set || expansionName,

        imageUrl: image,
        image_url: image,
        image,

        number:
          card.number ||
          card.printed_number ||
          card.number_display ||
          "",

        canonicalUrl:
          card.canonicalUrl ||
          card.canonical_path ||
          card.url ||
          "",

        url:
          card.url ||
          card.canonical_path ||
          card.canonicalUrl ||
          "",

        canonical_path:
          card.canonical_path ||
          card.url ||
          card.canonicalUrl ||
          "",

        price: priceString,
        rarity: card.rarity || "Standard",

        sales30dNum: parseInt(
          String(card.sales30d || "0").replace(/,/g, "") || "0",
          10
        ),

        sales90dNum: parseInt(
          String(card.sales90d || "0").replace(/,/g, "") || "0",
          10
        ),

        avgPrice30dNum: parseFloat(
          String(card.avgPrice30d || "0").replace(/[$,]/g, "") || "0"
        ),

        avgPrice90dNum: parseFloat(
          String(card.avgPrice90d || "0").replace(/[$,]/g, "") || "0"
        ),

        liquidityScoreNum: parseFloat(
          String(card.liquidityScore || "0").replace(/,/g, "") || "0"
        ),

        change7dNum: parseFloat(
          String(card.change_7d || card.change || "0").replace(/[%\s]/g, "") ||
            "0"
        ),

        change30dNum: parseFloat(
          String(card.change_30d || "0").replace(/[%\s]/g, "") || "0"
        ),

        fullPsaPop: card.full_psa_pop || null,
      };
    });

    return {
      success: true,
      set: setInfo,
      assets: formattedAssets,
      metadata,
    };
  } catch (error) {
    console.error("fetchSetDetails Error:", error);

    return {
      success: false,
      set: null,
      assets: [],
    };
  }
}

export async function fetchExpansionDetails(setId: string) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_BASE}/sets.php?id=${setId}`, {
      signal: controller.signal,
      next: { revalidate: 3600 } 
    });
    clearTimeout(id);
    if (!response.ok) return { success: false, data: null };
    const result = await response.json();
    if (!result.success || !result.data) return { success: false, data: null };

    return {
      success: true,
      data: {
        ...result.data,
        logoUrl: result.data.logoUrl || "https://pokecollectorhub.com/assets/placeholder-logo.png",
        cards: result.data.cards || []
      }
    };
  } catch (error) {
    console.error(`⚠️ Set Details Fetch Error (${setId}):`, error);
    return { success: false, data: null };
  }
}

export async function fetchCardsBySet(setName: string, game: string = "pokemon", limit: number = 6) {
  try {
    const cleanGame = game.toLowerCase() === "magic" ? "mtg" : game.toLowerCase();
    
    // Construct query parameters matching your PHP API specifications
    const queryParams = new URLSearchParams({
      game: cleanGame,
      set: setName,
      limit: limit.toString()
    });

    const response = await fetch(`${API_BASE}/cmc_cards.php?${queryParams.toString()}`, {
      next: { revalidate: 60 } // Standard cache
    });

    if (!response.ok) return [];
    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) return [];

    // Map and normalize fields so they match your frontend card components
    return result.data.map((card: any) => ({
      ...card,
      id: String(card.id),
      image: card.imageUrl || card.image_url || card.image || "https://pokecollectorhub.com/assets/placeholder.png",
      imageUrl: card.imageUrl || card.image_url,
      canonicalUrl: card.canonical_path || card.canonicalUrl || "",
      price: card.price || "$0.00",
      rarity: card.rarity || card.type || "Standard",
      priceNum: parseFloat(String(card.price || "0").replace(/[$,]/g, '') || "0")
    }));
  } catch (error) {
    console.error("Error inside fetchCardsBySet:", error);
    return [];
  }
}