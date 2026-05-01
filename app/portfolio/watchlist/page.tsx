import WatchlistPage from "@/components/portfolio/WatchlistPage";

// This would typically be a server-side fetch in a real app
async function getWatchlistData() {
  return {
    watchlist: {
      totalValue: 32415.20,
      growth7D: 9.72,
      totalCards: 42,
      alertsActive: 8,
      avgDailyChange: 312.45,
      
      // Data for the "Since Watchlist Created" card
      meta: {
        createdAt: "Apr 12, 2025",
        initialValue: 26200.00,
        totalIncrease: 6215.20,
        totalIncreasePercent: 23.76
      },

      // Updated Allocation data based on your screenshot (image_ba8bf0.png)
      allocation: [
        { name: 'PSA 10', value: 42.9, color: '#7c3aed' },
        { name: 'PSA 9', value: 23.8, color: '#3b82f6' },
        { name: 'Raw / Ungraded', value: 16.7, color: '#10b981' },
        { name: 'PSA 8', value: 9.5, color: '#f59e0b' },
        { name: 'PSA 7 & Below', value: 7.1, color: '#ef4444' },
      ],

      // Mock card data
      cards: [
        { id: 1, name: "Charizard", set: "Base Set Unlimited", grade: "PSA 10", value: 1000000, change7D: 18.7 },
        { id: 2, name: "Pikachu Illustrator", set: "Wizards Black Star", grade: "PSA 10", value: 5250000, change7D: 7.2 },
        { id: 3, name: "Blastoise", set: "Base Set Unlimited", grade: "PSA 10", value: 480000, change7D: 9.4 },
        { id: 4, name: "Venusaur", set: "Base Set Unlimited", grade: "PSA 9", value: 78500, change7D: 6.1 },
        { id: 5, name: "Lugia", set: "Neo Genesis", grade: "PSA 10", value: 295000, change7D: -8.2 },
      ]
    }
  };
}

export default async function Page() {
  const data = await getWatchlistData();

  return <WatchlistPage data={data} />;
}