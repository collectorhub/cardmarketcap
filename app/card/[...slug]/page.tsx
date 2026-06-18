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

  let cleanSlugSegments = [...originalSlug];

  if (cleanSlugSegments[0] === "card") {
    cleanSlugSegments = cleanSlugSegments.slice(1);
  }

  if (cleanSlugSegments.length === 0) {
    notFound();
  }

  const canonicalPath = "/" + cleanSlugSegments.join("/");

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
      game = cleanSlugSegments[1]?.toLowerCase() || "pokemon";
    } else {
      game = "pokemon";
    }
  }

  const cardData = await fetchCardByCanonicalUrl(canonicalPath, game, "psa 10");

  let finalizedCardData = cardData;

  if (!finalizedCardData && (cleanSlugSegments[0] === "en" || cleanSlugSegments[0] === "ja")) {
    const fallbackPath = "/" + cleanSlugSegments.slice(1).join("/");
    finalizedCardData = await fetchCardByCanonicalUrl(fallbackPath, game, "psa 10");
  }

  if (!finalizedCardData) {
    notFound();
  }

  let correlatedCards = [];

  try {
    const setName =
      finalizedCardData.set_name ||
      finalizedCardData.set ||
      finalizedCardData.expansion_name;

    if (setName && setName !== "Unknown Set") {
      const matchingSetCards = await fetchCardsBySet(setName, game, 10);

      if (Array.isArray(matchingSetCards)) {
        correlatedCards = matchingSetCards
          .filter(
            (item: any) =>
              String(item.id) !== String(finalizedCardData.id || finalizedCardData.source_id)
          )
          .map((item: any) => {
            const rawPath = item.canonical_path || item.canonicalUrl || item.url || "";
            let dynamicRoute = "";

            if (rawPath) {
              const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
              dynamicRoute = cleanPath.startsWith("/card") ? cleanPath : `/card${cleanPath}`;
            } else if (item.id) {
              dynamicRoute = `/card/${item.id}`;
            }

            return {
              ...item,
              canonical_path: dynamicRoute,
              canonicalUrl: dynamicRoute,
              url: dynamicRoute,
            };
          })
          .slice(0, 6);
      }
    }
  } catch (error) {
    console.error("Failed to query set correlations gracefully:", error);
  }

  return (
    <CardDetails
      key={finalizedCardData.id || finalizedCardData.source_id}
      card={finalizedCardData}
      relatedCards={correlatedCards}
    />
  );
}