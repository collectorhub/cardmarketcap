import { notFound } from "next/navigation";
import CardDetails from "@/components/CardDetails";
import { fetchCardById } from "@/lib/queries/market";
import { fetchPsaPopById } from "@/lib/queries/psa"; 

export default async function Page(props: { 
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ game?: string }>;
}) {
  // Await the promises provided by Next.js 15
  const params = await props.params;
  const searchParams = await props.searchParams;

  const slug = params.slug;
  const game = searchParams.game || "pokemon";

  if (!slug || slug.length === 0) {
    notFound();
  }

  // Extract the ID (last part of the slug)
  const id = slug[slug.length - 1];

  // Parallel fetch for market data and PSA population
  const [cardData, psaPop] = await Promise.all([
    fetchCardById(id, game),
    fetchPsaPopById(id)
  ]);

  if (!cardData) {
    notFound();
  }

  // Merge population data into the card object
  const cardWithPop = {
    ...cardData,
    population: psaPop || {} 
  };

  return <CardDetails card={cardWithPop} />;
}