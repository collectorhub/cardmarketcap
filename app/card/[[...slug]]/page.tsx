import { notFound } from "next/navigation";
import CardDetails from "@/components/CardDetails";
import { fetchCardById } from "@/lib/queries/market";

export default async function Page({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug?: string[] }>,
  searchParams: Promise<{ game?: string }> 
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams; // Get the game parameter (?game=lorcana)
  const slug = resolvedParams.slug;
  const game = resolvedSearch.game || "pokemon"; // Default to pokemon if missing

  if (!slug || slug.length === 0) {
    notFound();
  }

  // Extract the ID (last part of the slug)
  const id = slug[slug.length - 1];

  // Pass both ID and GAME to the fetch function
  const cardData = await fetchCardById(id, game);

  if (!cardData) {
    notFound();
  }

  return <CardDetails card={cardData} />;
}