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
      cards: [],
      sets: [],
      indices: [],
    };
  }
}

export async function globalSearch(query: string) {
  const q = query.trim();

  if (q.length < 2) {
    return {
      success: true,
      cards: [],
      sets: [],
      indices: [],
      count: 0,
    };
  }

  try {
    const params = new URLSearchParams();
    params.set("q", q);
    params.set("limit", "6");

    const res = await fetch(`${API_BASE}/global_search.php?${params.toString()}`, {
      cache: "no-store",
    });

    return await readJsonSafe(res);
  } catch (error) {
    console.error("globalSearch error:", error);

    return {
      success: false,
      message: "Search failed.",
      cards: [],
      sets: [],
      indices: [],
      count: 0,
    };
  }
}