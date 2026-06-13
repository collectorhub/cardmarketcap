"use server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchUniversalSearch(q: string, game: string | null = null, limit = 20) {
  try {
    const cleanQuery = q.trim();

    // Allow the search if a game is selected, even if cleanQuery is empty
    if (!cleanQuery && (!game || game === 'all')) {
        return [];
    }

    const params = new URLSearchParams({
      q: cleanQuery, 
      limit: limit.toString()
    });
    
    if (game && game !== 'all') {
      // Standardize game query key naming parameters
      let targetGame = game.toLowerCase();
      if (targetGame === "magic") targetGame = "mtg";
      params.append('game', targetGame);
    }

    const response = await fetch(
      `${API_BASE}/cmc_universal_search.php?${params.toString()}`, 
      {
        next: { revalidate: 60 } 
      }
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    if (!data.success || !Array.isArray(data.results)) return [];

    // Map and sanitize elements to align with market.ts conventions
    return data.results.map((card: any) => {
      const cardGame = (card.game || game || 'pokemon').toLowerCase();
      let rawPath = card.canonical_path || card.url || "";

      // Ensure the path always has a leading forward slash
      if (rawPath && !rawPath.startsWith('/')) {
        rawPath = '/' + rawPath;
      }

      // ✨ ROUTING PATH CORRECTION ENGINE
      // Intercepts database paths like "/pokemon/base-set/..." and converts to structural routes like "/card/en/pokemon/base-set/..."
      let correctedCanonicalPath = rawPath;
      if (rawPath && !rawPath.startsWith('/card')) {
        if (cardGame === 'pokemon') {
          // Check if path already embeds a language code, else apply the default English fallback locale
          if (rawPath.startsWith('/en/') || rawPath.startsWith('/ja/')) {
            correctedCanonicalPath = `/card${rawPath}`;
          } else {
            correctedCanonicalPath = `/card/en${rawPath}`;
          }
        } else {
          // For Non-Pokémon (MTG, Lorcana, One Piece), append standard cross-game route structures directly
          correctedCanonicalPath = `/card${rawPath}`;
        }
      }

      return {
        ...card,
        id: String(card.id),
        
        // Image Field Mapping Protection
        image: card.imageUrl || "https://pokecollectorhub.com/assets/placeholder.png",
        imageUrl: card.imageUrl || "https://pokecollectorhub.com/assets/placeholder.png",

        // Standardized Router Paths (Solves the Next.js 404 issue)
        url: correctedCanonicalPath,
        canonical_path: correctedCanonicalPath,
        canonicalUrl: correctedCanonicalPath,

        // Fallbacks for layout fields
        set: card.set || "Unknown Set",
        rarity: card.rarity || "Standard",

        // ✨ NUMERIC PIPELINES (Ensures instant calculation readiness in search cards/dropdown lists)
        priceNum: parseFloat(String(card.price || "0").replace(/[$,]/g, '') || "0"),
        marketCapNum: parseFloat(String(card.marketCap || "0").replace(/[$,]/g, '') || "0")
      };
    });
    
  } catch (error) {
    console.error("PHP Search Fetch Error:", error);
    return [];
  }
}