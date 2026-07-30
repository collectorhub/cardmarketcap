"use server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export type AdvertProvider =
  | "internal"
  | "tcgplayer"
  | "ebay";

export type AdvertPlacement =
  | "homepage_stats_card"
  | "card_details_sidebar";

export type AdvertRecord = {
  id: number;
  provider: AdvertProvider;
  external_id?: string | null;
  externalId?: string | null;
  sourceHash?: string | null;
  lastSyncedAt?: string | null;
  placement: AdvertPlacement;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  imageUrl?: string;
  target_url?: string;
  targetUrl?: string;
  cta_label?: string;
  ctaLabel?: string;
  disclosure?: string;
  status: "active" | "inactive";
  priority: number;
  weight: number;
  starts_at?: string | null;
  ends_at?: string | null;
  created_by?: number;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdvertFeedResponse = {
  success: boolean;
  placement?: AdvertPlacement;
  adverts: AdvertRecord[];
  uniqueAdverts: AdvertRecord[];
  count: number;
  uniqueCount: number;
  rotationInterval: number;
  advert: AdvertRecord | null;
  message?: string;
};

async function readJsonSafe(
  response: Response
) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message:
        text ||
        `Invalid JSON response. HTTP ${response.status}`,
    };
  }
}

function apiBase(): string {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not configured."
    );
  }

  return API_BASE.replace(/\/+$/, "");
}

export async function getAdminAdverts(
  placement?: string
) {
  try {
    const query = placement
      ? `?admin=1&placement=${encodeURIComponent(
          placement
        )}`
      : "?admin=1";

    const response = await fetch(
      `${apiBase()}/adverts.php${query}`,
      {
        cache: "no-store",
      }
    );

    const data =
      await readJsonSafe(response);

    if (!response.ok) {
      return {
        success: false,
        adverts: [],
        message:
          data.message ||
          `Backend error. HTTP ${response.status}`,
      };
    }

    return {
      ...data,
      adverts: Array.isArray(
        data.adverts
      )
        ? data.adverts
        : [],
    };
  } catch (error) {
    console.error(
      "getAdminAdverts error:",
      error
    );

    return {
      success: false,
      adverts: [],
      message: "Failed to fetch adverts.",
    };
  }
}

export async function getActiveAdverts(
  placement: AdvertPlacement,
  limit = 20
): Promise<AdvertFeedResponse> {
  try {
    const params =
      new URLSearchParams({
        placement,
        limit: String(limit),
      });

    const response = await fetch(
      `${apiBase()}/adverts.php?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    const data =
      await readJsonSafe(response);

    const adverts =
      Array.isArray(data.adverts)
        ? data.adverts
        : data.advert
        ? [data.advert]
        : [];

    const uniqueAdverts =
      Array.isArray(
        data.uniqueAdverts
      )
        ? data.uniqueAdverts
        : adverts;

    if (!response.ok) {
      return {
        success: false,
        adverts: [],
        uniqueAdverts: [],
        count: 0,
        uniqueCount: 0,
        rotationInterval: 10000,
        advert: null,
        message:
          data.message ||
          `Backend error. HTTP ${response.status}`,
      };
    }

    return {
      success: Boolean(data.success),
      placement,
      adverts,
      uniqueAdverts,
      count:
        typeof data.count === "number"
          ? data.count
          : adverts.length,
      uniqueCount:
        typeof data.uniqueCount ===
        "number"
          ? data.uniqueCount
          : uniqueAdverts.length,
      rotationInterval:
        typeof data.rotationInterval ===
        "number"
          ? data.rotationInterval
          : 10000,
      advert:
        data.advert ||
        adverts[0] ||
        null,
      message: data.message,
    };
  } catch (error) {
    console.error(
      "getActiveAdverts error:",
      error
    );

    return {
      success: false,
      adverts: [],
      uniqueAdverts: [],
      count: 0,
      uniqueCount: 0,
      rotationInterval: 10000,
      advert: null,
      message:
        "Failed to fetch active adverts.",
    };
  }
}

/**
 * Backward compatibility for old components expecting only one advert.
 */
export async function getActiveAdvert(
  placement: AdvertPlacement
) {
  const response =
    await getActiveAdverts(
      placement,
      20
    );

  return {
    ...response,
    advert:
      response.advert ||
      response.adverts[0] ||
      null,
  };
}

export async function saveAdvert(
  payload: any
) {
  try {
    const response = await fetch(
      `${apiBase()}/adverts.php`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          id: Number(payload.id || 0),
          provider: String(
            payload.provider ||
            "internal"
          )
            .trim()
            .toLowerCase(),
          external_id: String(
            payload.external_id ||
            payload.externalId ||
            ""
          ).trim(),
          placement: String(
            payload.placement ||
            "homepage_stats_card"
          ).trim(),
          title: String(
            payload.title || ""
          ).trim(),
          subtitle: String(
            payload.subtitle || ""
          ).trim(),
          description: String(
            payload.description || ""
          ).trim(),
          image_url: String(
            payload.image_url ||
            payload.imageUrl ||
            ""
          ).trim(),
          target_url: String(
            payload.target_url ||
            payload.targetUrl ||
            ""
          ).trim(),
          cta_label: String(
            payload.cta_label ||
            payload.ctaLabel ||
            "Learn More"
          ).trim(),
          disclosure: String(
            payload.disclosure || ""
          ).trim(),
          status: String(
            payload.status ||
            "active"
          )
            .trim()
            .toLowerCase(),
          priority: Number(
            payload.priority || 0
          ),
          weight: Math.max(
            1,
            Math.min(
              10,
              Number(
                payload.weight || 1
              )
            )
          ),
          starts_at: String(
            payload.starts_at || ""
          ).trim(),
          ends_at: String(
            payload.ends_at || ""
          ).trim(),
          created_by: Number(
            payload.created_by ||
            payload.user_id ||
            0
          ),
        }),
      }
    );

    const data =
      await readJsonSafe(response);

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          `Backend error. HTTP ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error(
      "saveAdvert error:",
      error
    );

    return {
      success: false,
      message: "Failed to save advert.",
    };
  }
}

export async function deleteAdvert(
  id: number
) {
  try {
    const response = await fetch(
      `${apiBase()}/adverts.php`,
      {
        method: "DELETE",
        headers: {
          "Content-Type":
            "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          id: Number(id),
        }),
      }
    );

    const data =
      await readJsonSafe(response);

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          `Backend error. HTTP ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error(
      "deleteAdvert error:",
      error
    );

    return {
      success: false,
      message: "Failed to delete advert.",
    };
  }
}

export async function syncTcgplayerAdverts() {
  try {
    const syncSecret =
      process.env.IMPACT_SYNC_SECRET;

    if (!syncSecret) {
      return {
        success: false,
        message:
          "IMPACT_SYNC_SECRET is not configured on the Next.js server.",
      };
    }

    const response = await fetch(
      `${apiBase()}/tcgplayer_ads_sync.php`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          "X-Sync-Secret":
            syncSecret,
        },
        cache: "no-store",
      }
    );

    const data =
      await readJsonSafe(response);

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          `Backend error. HTTP ${response.status}`,
        error: data.error,
      };
    }

    return data;
  } catch (error) {
    console.error(
      "syncTcgplayerAdverts error:",
      error
    );

    return {
      success: false,
      message:
        "Failed to synchronize TCGplayer adverts.",
    };
  }
}
