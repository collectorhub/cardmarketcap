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

export async function getAdminAdverts(placement?: string) {
  try {
    const query = placement
      ? `?admin=1&placement=${encodeURIComponent(placement)}`
      : "?admin=1";

    const res = await fetch(`${API_BASE}/adverts.php${query}`, {
      cache: "no-store",
    });

    return await readJsonSafe(res);
  } catch (error) {
    console.error("getAdminAdverts error:", error);
    return {
      success: false,
      adverts: [],
      message: "Failed to fetch adverts.",
    };
  }
}

export async function getActiveAdvert(placement: string) {
  try {
    const res = await fetch(
      `${API_BASE}/adverts.php?placement=${encodeURIComponent(placement)}`,
      { cache: "no-store" }
    );

    return await readJsonSafe(res);
  } catch (error) {
    console.error("getActiveAdvert error:", error);
    return {
      success: false,
      advert: null,
      message: "Failed to fetch active advert.",
    };
  }
}

export async function saveAdvert(payload: any) {
  try {
    const res = await fetch(`${API_BASE}/adverts.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        id: Number(payload.id || 0),
        placement: String(payload.placement || "homepage_stats_card").trim(),
        title: String(payload.title || "").trim(),
        subtitle: String(payload.subtitle || "").trim(),
        description: String(payload.description || "").trim(),
        image_url: String(payload.image_url || payload.imageUrl || "").trim(),
        target_url: String(payload.target_url || payload.targetUrl || "").trim(),
        cta_label: String(payload.cta_label || payload.ctaLabel || "Learn More").trim(),
        status: String(payload.status || "active").trim(),
        priority: Number(payload.priority || 0),
        starts_at: String(payload.starts_at || "").trim(),
        ends_at: String(payload.ends_at || "").trim(),
        created_by: Number(payload.created_by || payload.user_id || 0),
      }),
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
    console.error("saveAdvert error:", error);
    return {
      success: false,
      message: "Failed to save advert.",
    };
  }
}

export async function deleteAdvert(id: number) {
  try {
    const res = await fetch(`${API_BASE}/adverts.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ id: Number(id) }),
    });

    return await readJsonSafe(res);
  } catch (error) {
    console.error("deleteAdvert error:", error);
    return {
      success: false,
      message: "Failed to delete advert.",
    };
  }
}