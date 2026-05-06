// app/watchlist/page.tsx
import WatchlistPage from "@/components/portfolio/WatchlistPage";
import { getWatchlist } from "@/lib/queries/portfolio";

export default async function Page() {
  // Hardcoded User ID 12 for now as per your PHP logic
  const response = await getWatchlist(12);

  if (!response.success) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-xl font-bold text-red-500">Error Loading Watchlist</h1>
        <p className="text-slate-500">{response.message}</p>
      </div>
    );
  }

  // We map the PHP response to the UI's expected format
  const data = {
    watchlist: {
      ...response.data,
      // Fallbacks for data your PHP doesn't calculate yet
      growth7D: response.data.growth7D || 0,
      activeAlerts: 0, 
      avgDailyChange: 0,
      meta: {
        createdAt: "May 2026",
        initialValue: response.data.totalValue,
        totalIncrease: 0,
        totalIncreasePercent: 0
      }
    }
  };

  return <WatchlistPage data={data} />;
}