"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function readJsonSafe(res: Response) {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: text || `Invalid JSON response. HTTP ${res.status}`,
    };
  }
}

export async function getAdminPricingSales(params: {
  search?: string;
  tab?: "all_sales" | "anomalies" | "verified_pricing";
}) {
  const searchParams = new URLSearchParams();

  searchParams.set("search", params.search || "");
  searchParams.set("tab", params.tab || "all_sales");
  searchParams.set("limit", "50");

  try {
    const res = await fetch(
      `${API_BASE}/admin_pricing_sales.php?${searchParams.toString()}`,
      { cache: "no-store" }
    );

    return await readJsonSafe(res);
  } catch (error) {
    console.error("getAdminPricingSales error:", error);

    return {
      success: false,
      summary: {
        totalSalesProcessed: 0,
        avgCardValue: 0,
        activeAnomaliesCount: 0,
        healthyStreamRate: "0%",
      },
      sales: [],
    };
  }
}

export async function resolveAdminPricingSale(payload: {
  id: string;
  action: "approve" | "quarantine";
  user_id?: number;
  reason?: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/admin_pricing_sales.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    return await readJsonSafe(res);
  } catch (error) {
    console.error("resolveAdminPricingSale error:", error);

    return {
      success: false,
      message: "Failed to save pricing action.",
    };
  }
}