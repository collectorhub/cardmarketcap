import { notFound } from "next/navigation";
import CardDetails from "@/components/CardDetails";
import { fetchCardById } from "@/lib/queries/market";

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Handle cases where the URL is just /card/
  if (!slug || slug.length === 0) {
    notFound();
  }

  // 2. Extract the ID (it is always the last part of the canonical path)
  // Example: ["ja", "pokemon", "adv-expansion-pack", "adv1_ja-1"] -> "adv1_ja-1"
  const id = slug[slug.length - 1];

  // 3. Fetch data using the existing unified function
  const cardData = await fetchCardById(id);

  if (!cardData) {
    notFound();
  }

  // 4. (Optional) Validation: 
  // If you want to be strict about SEO, you can check if the current URL 
  // matches the cardData.canonicalUrl. If not, you could redirect to the correct one.

  return <CardDetails card={cardData} />;
}