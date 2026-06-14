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

export async function getIndices(category?: "market" | "index" | "specialty") {
  try {
    const url = category
      ? `${API_BASE}/get_indices.php?category=${encodeURIComponent(category)}`
      : `${API_BASE}/get_indices.php`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    const data = await readJsonSafe(res);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Backend error. HTTP ${res.status}`,
        indices: [],
        grouped: {
          market: [],
          index: [],
          specialty: [],
        },
      };
    }

    return data;
  } catch (error) {
    console.error("getIndices error:", error);

    return {
      success: false,
      message: "Failed to fetch indices.",
      indices: [],
      grouped: {
        market: [],
        index: [],
        specialty: [],
      },
    };
  }
}

export async function getIndexDetails(slug: string) {
  if (!slug) {
    return {
      success: false,
      message: "Index slug is required.",
      index: null,
      stats: null,
      performance: null,
      allocation: null,
      summary: null,
      cards: [],
    };
  }

  try {
    const res = await fetch(
      `${API_BASE}/get_index_details.php?slug=${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    );

    const data = await readJsonSafe(res);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Backend error. HTTP ${res.status}`,
        index: null,
        stats: null,
        performance: null,
        allocation: null,
        summary: null,
        cards: [],
      };
    }

    return data;
  } catch (error) {
    console.error("getIndexDetails error:", error);

    return {
      success: false,
      message: "Failed to fetch index details.",
      index: null,
      stats: null,
      performance: null,
      allocation: null,
      summary: null,
      cards: [],
    };
  }
}