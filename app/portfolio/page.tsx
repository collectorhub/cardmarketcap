"use client";

import React from 'react';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';

const PORTFOLIO_DATA = {
  user: { name: "Dave", status: "Pro Collector" },
  stats: {
    totalValue: 48725.60,
    growth7D: 12.48,
    totalCards: 126,
    totalSets: 18
  },
  topAssets: [
    { n: 'Charizard #4', s: 'Base Set Unlimited', g: 'PSA 10', v: '$1,000,000' },
    { n: 'Blastoise #2', s: 'Base Set Unlimited', g: 'PSA 10', v: '$480,000' },
    { n: 'Venusaur #15', s: 'Base Set Unlimited', g: 'PSA 9', v: '$78,500' },
  ]
};

export default function PortfolioPage() {
  return (
    // Removed hardcoded bg-white and text-slate-900 to inherit from Layout
    <div className="w-full">
      <PortfolioDashboard data={PORTFOLIO_DATA} />
    </div>
  );
}