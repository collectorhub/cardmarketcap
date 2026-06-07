import { notFound } from "next/navigation";
import CardDetails from "@/components/CardDetails";
import { fetchCardByCanonicalUrl, fetchCardsBySet } from "@/lib/queries/market";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ game?: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const originalSlug = params.slug;
  if (!originalSlug || originalSlug.length === 0) {
    notFound();
  }

  // --- 1. RECONSTRUCT THE TRUE CANONICAL PATH ---
  // We clean out the generic app layout router prefixes like "card" if it leaks into the slug,
  // but we keep language or game keys essential for your DB matching.
  let cleanSlugSegments = [...originalSlug];
  if (cleanSlugSegments[0] === "card") {
    cleanSlugSegments = cleanSlugSegments.slice(1);
  }

  if (cleanSlugSegments.length === 0) {
    notFound();
  }

  const canonicalPath = "/" + cleanSlugSegments.join("/");

  // --- 2. DETECT THE GAME MODE ---
  let game = searchParams.game?.toLowerCase();
  if (!game) {
    const rootSegment = cleanSlugSegments[0].toLowerCase();
    if (rootSegment === "mtg" || rootSegment === "magic") {
      game = "mtg";
    } else if (rootSegment === "lorcana") {
      game = "lorcana";
    } else if (rootSegment === "onepiece" || rootSegment === "one-piece") {
      game = "onepiece";
    } else if (rootSegment === "en" || rootSegment === "ja") {
      // If path is /en/pokemon/..., grab "pokemon" from index 1
      game = cleanSlugSegments[1]?.toLowerCase() || "pokemon";
    } else {
      game = "pokemon";
    }
  }

  // --- 3. EXECUTE THE UNIFIED LOOKUP ---
  const cardData = await fetchCardByCanonicalUrl(canonicalPath, game);

  // Fallback: If not found with standard path, try checking without the leading language folder segment
  let finalizedCardData = cardData;
  if (!finalizedCardData && (cleanSlugSegments[0] === "en" || cleanSlugSegments[0] === "ja")) {
    const fallbackPath = "/" + cleanSlugSegments.slice(1).join("/");
    finalizedCardData = await fetchCardByCanonicalUrl(fallbackPath, game);
  }

  if (!finalizedCardData) {
    notFound();
  }

  // --- 4. ROBUST END-TO-END SET CORRELATIONS FETCHING ---
  let correlatedCards = [];
  try {
    const setName = finalizedCardData.set_name || finalizedCardData.set || finalizedCardData.expansion_name;
    
    if (setName && setName !== "Unknown Set") {
      const matchingSetCards = await fetchCardsBySet(setName, game, 10);
      
      if (Array.isArray(matchingSetCards)) {
        correlatedCards = matchingSetCards
          .filter((item: any) => String(item.id) !== String(finalizedCardData.id || finalizedCardData.source_id))
          .map((item: any) => {
            // INTEGRATING YOUR EXACT MARKETTABLE PREFIX LOGIC HERE:
            const rawPath = item.canonical_path || item.canonicalUrl || item.url || "";
            let dynamicRoute = "";

            if (rawPath) {
              const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
              dynamicRoute = cleanPath.startsWith('/card') ? cleanPath : `/card${cleanPath}`;
            } else if (item.id) {
              dynamicRoute = `/card/${item.id}`;
            }

            // We return the item with its paths updated to use the fixed route
            return {
              ...item,
              canonical_path: dynamicRoute,
              canonicalUrl: dynamicRoute,
              url: dynamicRoute
            };
          })
          .slice(0, 6); // Kept your original slice of 6 cards
      }
    }
  } catch (error) {
    console.error("Failed to query set correlations gracefully:", error);
  }

  // Adding the key property forces Next.js to completely re-render 
  // the client view when switching between related cards
  return (
    <CardDetails 
      key={finalizedCardData.id || finalizedCardData.source_id} 
      card={finalizedCardData} 
      relatedCards={correlatedCards} 
    />
  );
}