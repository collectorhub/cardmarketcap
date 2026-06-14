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

export async function getAdminIndices() {
  try {
    const res = await fetch(`${API_BASE}/indices.php`, {
      cache: "no-store",
    });

    return await readJsonSafe(res);
  } catch (error) {
    console.error("getAdminIndices error:", error);
    return { success: false, indices: [], message: "Failed to fetch indices." };
  }
}

export async function saveIndex(payload: any) {
  try {
    const res = await fetch(`${API_BASE}/indices.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(payload.id || 0),
        name: String(payload.name || "").trim(),
        slug: String(payload.slug || "").trim(),
        description: String(payload.description || "").trim(),
        category: String(payload.category || "index").toLowerCase(),
        is_active: Number(payload.is_active) === 1 ? 1 : 0,
        user_id: Number(payload.user_id || 0),
      }),
      cache: "no-store",
    });

    const data = await readJsonSafe(res);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Backend error. HTTP ${res.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error("saveIndex error:", error);
    return { success: false, message: "Failed to save index." };
  }
}

export async function deleteIndex(id: number) {
  try {
    const res = await fetch(`${API_BASE}/indices.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      cache: "no-store",
    });

    return await readJsonSafe(res);
  } catch {
    return { success: false, message: "Failed to delete index." };
  }
}

export async function getIndexCards(indexId: number) {
  try {
    const res = await fetch(`${API_BASE}/index_cards.php?index_id=${indexId}`, {
      cache: "no-store",
    });

    return await readJsonSafe(res);
  } catch {
    return { success: false, cards: [], message: "Failed to fetch index cards." };
  }
}

export async function saveIndexCard(payload: any) {
  try {
    const res = await fetch(`${API_BASE}/index_cards.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(payload.id || 0),
        index_id: Number(payload.index_id || 0),
        card_id: String(payload.card_id || "").trim(),
        grade: String(payload.grade || "PSA 10").trim(),
        weight: Number(payload.weight || 1),
        sort_order: Number(payload.sort_order || 0),
        user_id: Number(payload.user_id || 0),
      }),
      cache: "no-store",
    });

    const data = await readJsonSafe(res);

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Backend error. HTTP ${res.status}`,
      };
    }

    return data;
  } catch {
    return { success: false, message: "Failed to save index card." };
  }
}

export async function removeIndexCard(id: number, indexId: number) {
  try {
    const res = await fetch(`${API_BASE}/index_cards.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, index_id: indexId }),
      cache: "no-store",
    });

    return await readJsonSafe(res);
  } catch {
    return { success: false, message: "Failed to remove card." };
  }
}

export async function searchCardsForIndex(query: string) {
  if (!query.trim()) return { success: true, cards: [] };

  try {
    const res = await fetch(
      `${API_BASE}/search_cards_for_index.php?q=${encodeURIComponent(query)}&limit=20`,
      { cache: "no-store" }
    );

    return await readJsonSafe(res);
  } catch {
    return { success: false, cards: [], message: "Search failed." };
  }
}