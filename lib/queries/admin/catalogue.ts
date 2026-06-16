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

export async function getAdminCatalogue(params: {
  page?: number;
  search?: string;
  sort?: string;
  subcat?: string;
  grade?: string;
}) {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page || 1));
  searchParams.set("limit", "50");
  searchParams.set("search", params.search || "");
  searchParams.set("sort", params.sort || "Top");
  searchParams.set("subcat", params.subcat || "All");
  searchParams.set("grade", params.grade || "PSA 10");

  try {
    const res = await fetch(
      `${API_BASE}/admin_catalogue.php?${searchParams.toString()}`,
      { cache: "no-store" }
    );

    return await readJsonSafe(res);
  } catch (error) {
    console.error("getAdminCatalogue error:", error);

    return {
      success: false,
      cards: [],
      metadata: {
        totalRecords: 0,
        totalPages: 1,
        currentPage: 1,
      },
    };
  }
}

export async function saveAdminCardOverride(payload: {
  target_id: string;
  override_value: string;
  created_by?: number;
}) {
  try {
    const res = await fetch(`${API_BASE}/admin_catalogue.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        target_id: payload.target_id,
        field_name: "display_name",
        override_value: payload.override_value,
        created_by: payload.created_by || 0,
      }),
    });

    return await readJsonSafe(res);
  } catch (error) {
    console.error("saveAdminCardOverride error:", error);

    return {
      success: false,
      message: "Failed to save override.",
    };
  }
}