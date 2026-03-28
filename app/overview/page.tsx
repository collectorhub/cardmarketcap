import { MarketOverview } from "@/components/MarketOverview";
import { fetchMarketStats, fetchTrendingCards } from "@/lib/queries/market";

export default async function Page() {
  // Fetch both sets of data in parallel for speed
  const [statsData, trendingCards] = await Promise.all([
    fetchMarketStats(),
    fetchTrendingCards()
  ]);

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <MarketOverview 
        initialData={statsData.stats} 
        sentimentScore={statsData.sentimentScore} 
        cards={trendingCards} 
      />
    </div>
  );
}