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

export async function getAdminPSAPopManager(params: {
  search?: string;
  tab?: string;
}) {
  const searchParams = new URLSearchParams();

  searchParams.set("search", params.search || "");
  searchParams.set("tab", params.tab || "all");
  searchParams.set("limit", "50");

  try {
    const res = await fetch(
      `${API_BASE}/admin_psa_pop_manager.php?${searchParams.toString()}`,
      { cache: "no-store" }
    );

    return await readJsonSafe(res);
  } catch (error) {
    console.error("getAdminPSAPopManager error:", error);

    return {
      success: false,
      summary: {
        totalPop: 0,
        unlinkedCount: 0,
        variantConflicts: 0,
        verifiedCount: 0,
      },
      items: [],
    };
  }
}

export async function resolveAdminPSAPop(payload: {
  id: string;
  action: "approve" | "reject" | "adjust_variant";
  user_id?: number;
  scraped_title?: string;
  proposed_card_id?: string;
  proposed_card_name?: string;
  proposed_set_name?: string;
  confidence_score?: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/admin_psa_pop_manager.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    return await readJsonSafe(res);
  } catch (error) {
    console.error("resolveAdminPSAPop error:", error);

    return {
      success: false,
      message: "Failed to save PSA action.",
    };
  }
}