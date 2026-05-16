import { notFound } from "next/navigation";
import CardDetails from "@/components/CardDetails";
import { fetchCardByCanonicalUrl } from "@/lib/queries/market"; // Import updated function
import { fetchPsaPopById } from "@/lib/queries/psa"; 

export default async function Page(props: { 
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ game?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  let slug = params.slug;
  if (!slug || slug.length === 0) {
    notFound();
  }

  if (slug[0] === "card") {
    slug = slug.slice(1);
  }

  if (slug.length === 0) {
    notFound();
  }

  // 1. RECONSTRUCT THE CANONICAL PATH FROM URL
  const canonicalPath = "/" + slug.join("/");

  // 2. DETECT THE GAME MODE
  let game = searchParams.game?.toLowerCase();
  if (!game) {
    const rootSegment = slug[0].toLowerCase();
    if (rootSegment === "mtg" || rootSegment === "magic") {
      game = "mtg";
    } else if (rootSegment === "lorcana") {
      game = "lorcana";
    } else if (rootSegment === "onepiece" || rootSegment === "one-piece") {
      game = "onepiece";
    } else if (rootSegment === "en" || rootSegment === "ja") {
      game = slug[1]?.toLowerCase() || "pokemon";
    } else {
      game = "pokemon";
    }
  }

  // 3. EXECUTE THE NEW UNIFIED LOOKUP
  const cardData = await fetchCardByCanonicalUrl(canonicalPath, game);

  if (!cardData) {
    notFound();
  }

  // 4. ATTACH PSA POPULATION STATISTICS
  const targetId = cardData.id || cardData.source_id || slug[slug.length - 1];
  const psaPop = await fetchPsaPopById(String(targetId).toUpperCase());

  const cardWithPop = {
    ...cardData,
    population: psaPop || {} 
  };

  return <CardDetails card={cardWithPop} />;
}