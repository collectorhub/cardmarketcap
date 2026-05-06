// app/portfolio/page.tsx
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import { getWatchlist } from "@/lib/queries/portfolio";

export default async function PortfolioPage() {
  const response = await getWatchlist(12);

  if (!response.success) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-xl font-bold text-red-500">Error Loading Portfolio</h1>
        <p className="text-slate-500">{response.message}</p>
      </div>
    );
  }

  const apiData = response.data;

  const data = {
    stats: {
      totalValue: apiData.totalValue || 0,
      totalCards: apiData.totalCards || 0,
      totalSets: apiData.setCount || 0,
    },
    performance: {
      change7D: apiData.growth7D_Value || 0,
      change7DPct: apiData.growth7D || 0,
    },
    cards: (apiData.cards || []).map((card: any) => ({
      name: card.name,
      setName: card.set || 'N/A',
      grade: card.grade || 'Raw',
      value: card.value || 0,
      change: card.change7D || 0,
      image: card.imageUrl,
    })),
    allocation: apiData.allocation || [],
    
    // ADD THIS: Check if backend has activity, otherwise use an empty array
    recentActivity: apiData.recentActivity || [] 
  };

  return (
    <div className="w-full">
      <PortfolioDashboard data={data} />
    </div>
  );
}