import { notFound } from "next/navigation";
import CardDetails from "@/components/CardDetails";
import { fetchCardById } from "@/lib/queries/market";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // 1. Unwrap params
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Fetch data using the unified function
  const cardData = await fetchCardById(id);

  // 3. Handle 404
  if (!cardData) {
    notFound();
  }

  // 4. Return UI
  return <CardDetails card={cardData} />;
}