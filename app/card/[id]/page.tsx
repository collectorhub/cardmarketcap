import { notFound } from "next/navigation";
import CardDetails from "@/components/CardDetails";
import { fetchCardById } from "@/lib/queries/market"; // Updated to match your naming convention

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // 1. Unwrapping params (Promise)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Fetch data using the new function
  const cardData = await fetchCardById(id);

  // 3. Handle 404
  if (!cardData) {
    notFound();
  }

  return <CardDetails card={cardData} />;
}