import { MarketOverview } from "@/components/MarketOverview";
import { fetchMarketStats, fetchTrendingCards } from "@/lib/queries/market";
import { getIndices } from "@/lib/queries/indices";

function safeNumber(value: any) {
  const n = Number(String(value || "0").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function normalize(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findStat(stats: any[], label: string) {
  const target = normalize(label);
  return stats.find((s: any) => normalize(s.label) === target);
}

function findIndex(indices: any[], keyword: string) {
  const target = normalize(keyword);

  return indices.find((item: any) => {
    const name = normalize(item?.name || item?.index?.name || item?.title || item?.label || "");
    const slug = normalize(item?.slug || "");
    return name.includes(target) || slug.includes(target);
  });
}

function getIndexValue(index: any) {
  return (
    index?.stats?.totalValue ||
    index?.totalValue ||
    index?.value ||
    index?.indexValue ||
    index?.marketCap ||
    "$0"
  );
}

function getIndexChange(index: any) {
  return (
    index?.performance?.change30DPct ??
    index?.change30DPct ??
    index?.change30dPct ??
    index?.change_30d_pct ??
    index?.change ??
    0
  );
}

function formatChange(value: any) {
  if (String(value || "").toLowerCase() === "live") return "Live";

  const n = safeNumber(value);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function trendFromChange(value: any): "up" | "down" {
  return safeNumber(value) < 0 ? "down" : "up";
}

export default async function Page() {
  const [statsData, trendingCards, indicesData] = await Promise.all([
    fetchMarketStats(),
    fetchTrendingCards(),
    getIndices(),
  ]);

  const apiStats = statsData?.stats || [];
  const indices = indicesData?.indices || [];

  const totalMarketCap = findStat(apiStats, "Total Market Cap");
  const trackedCards = findStat(apiStats, "Tracked Cards");
  const psa10Index = findStat(apiStats, "PSA 10 Index");
  const modern100 = findStat(apiStats, "Modern 100");

  const top20 = findIndex(indices, "Top 20");
  const top50 = findIndex(indices, "Top 50");
  const vintage50 = findIndex(indices, "Vintage 50");

  const synchronizedStats = [
    {
      label: "Total Market Cap",
      value: totalMarketCap?.value || "$1.1B",
      change: totalMarketCap?.change || "+2.1%",
      trend: trendFromChange(totalMarketCap?.change || "+2.1%"),
    },
    {
      label: "Tracked Cards",
      value: trackedCards?.value || "35,051",
      change: trackedCards?.change || "Live",
      trend: "up" as const,
    },
    {
      label: "Top 20 Index",
      value: getIndexValue(top20),
      change: formatChange(getIndexChange(top20)),
      trend: trendFromChange(getIndexChange(top20)),
    },
    {
      label: "Top 50 Index",
      value: getIndexValue(top50),
      change: formatChange(getIndexChange(top50)),
      trend: trendFromChange(getIndexChange(top50)),
    },
    {
      label: "PSA 10 Index",
      value: psa10Index?.value || "2,396",
      change: psa10Index?.change || "+0.6%",
      trend: trendFromChange(psa10Index?.change || "+0.6%"),
    },
    {
      label: "Modern 100",
      value: modern100?.value || "1,720",
      change: modern100?.change || "-1.1%",
      trend: trendFromChange(modern100?.change || "-1.1%"),
    },
    {
      label: "Vintage 50 Index",
      value: getIndexValue(vintage50),
      change: formatChange(getIndexChange(vintage50)),
      trend: trendFromChange(getIndexChange(vintage50)),
    },
  ].filter((item) => item.value && item.value !== "$0");

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <MarketOverview
        initialData={synchronizedStats}
        sentimentScore={statsData?.sentimentScore || 50}
        cards={trendingCards || []}
      />
    </div>
  );
}