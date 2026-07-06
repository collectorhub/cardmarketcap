"use server"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchUniversalSearch(
  q: string,
  game: string | null = null,
  limit = 20,
  grade = "psa 10"
) {
  try {
    const cleanQuery = q.trim();
    const cleanGrade = grade.toLowerCase().trim();

    if (!cleanQuery && (!game || game === "all")) {
      return [];
    }

    const params = new URLSearchParams({
      q: cleanQuery,
      limit: limit.toString(),
      grade: cleanGrade,
    });

    if (game && game !== "all") {
      let targetGame = game.toLowerCase();
      if (targetGame === "magic") targetGame = "mtg";
      params.append("game", targetGame);
    }

    const response = await fetch(
      `${API_BASE}/cmc_universal_search.php?${params.toString()}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    if (!data.success || !Array.isArray(data.results)) return [];

    return data.results.map((card: any) => {
      const cardGame = (card.game || game || "pokemon").toLowerCase();
      let rawPath = card.canonical_path || card.url || "";

      if (rawPath && !rawPath.startsWith("/")) {
        rawPath = "/" + rawPath;
      }

      let correctedCanonicalPath = rawPath;
      if (rawPath && !rawPath.startsWith("/card")) {
        if (cardGame === "pokemon") {
          if (rawPath.startsWith("/en/") || rawPath.startsWith("/ja/")) {
            correctedCanonicalPath = `/card${rawPath}`;
          } else {
            correctedCanonicalPath = `/card/en${rawPath}`;
          }
        } else {
          correctedCanonicalPath = `/card${rawPath}`;
        }
      }

      return {
        ...card,
        id: String(card.id),

        image:
          card.imageUrl ||
          "https://pokecollectorhub.com/assets/placeholder.png",
        imageUrl:
          card.imageUrl ||
          "https://pokecollectorhub.com/assets/placeholder.png",

        url: correctedCanonicalPath,
        canonical_path: correctedCanonicalPath,
        canonicalUrl: correctedCanonicalPath,

        set: card.set || "Unknown Set",
        rarity: card.rarity || "Standard",

        priceNum: parseFloat(
          String(card.price || "0").replace(/[$,]/g, "") || "0"
        ),
        marketCapNum: parseFloat(
          String(card.marketCap || "0").replace(/[$,]/g, "") || "0"
        ),
      };
    });
  } catch (error) {
    console.error("PHP Search Fetch Error:", error);
    return [];
  }
}