"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export type EbayShopSection =
  | "graded"
  | "graded_auction"
  | "raw"
  | "auction"
  | "sealed";

export type EbayShopSort =
  | "best_match"
  | "price_asc"
  | "price_desc"
  | "newly_listed"
  | "ending_soon";

export type EbayShopListing = {
  id?: string;
  itemId?: string;
  title?: string;
  image?: string;
  price?: string | number | null;
  currency?: string;
  formattedPrice?: string;
  url?: string;
  rawUrl?: string;
  condition?: string;
  buyingOptions?: string[];
  itemEndDate?: string | null;
};

export type EbayShopResponse = {
  success: boolean;
  source?: string;
  section?: EbayShopSection;
  search?: string;
  resolvedQuery?: string;
  sort?: EbayShopSort;
  count: number;
  total: number | null;
  ebayTotal?: number | null;
  limit?: number;
  offset?: number;
  hasMore: boolean;
  results: EbayShopListing[];
};

const createEmptyShopResponse = (): EbayShopResponse => ({
  success: false,
  results: [],
  total: 0,
  count: 0,
  hasMore: false,
});

export async function fetchEbayShopListings({
  section = "graded",
  search = "",
  sort = "best_match",
  limit = 24,
  offset = 0,
}: {
  section?: EbayShopSection;
  search?: string;
  sort?: EbayShopSort;
  limit?: number;
  offset?: number;
}): Promise<EbayShopResponse> {
  try {
    if (!API_BASE) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not configured."
      );
    }

    const params = new URLSearchParams({
      section,
      search,
      sort,
      limit: String(limit),
      offset: String(offset),
    });

    const response = await fetch(
      `${API_BASE}/ebay_shop.php?${params.toString()}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch eBay shop listings: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data?.success || !Array.isArray(data?.results)) {
      return createEmptyShopResponse();
    }

    return {
      ...data,
      count:
        typeof data.count === "number"
          ? data.count
          : data.results.length,
      total:
        typeof data.total === "number"
          ? data.total
          : null,
      hasMore: Boolean(data.hasMore),
      results: data.results,
    };
  } catch (error) {
    console.error("eBay Shop Fetch Error:", error);

    return createEmptyShopResponse();
  }
}

export async function fetchEbayFeatured(limit = 8) {
  try {
    if (!API_BASE) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not configured."
      );
    }

    const params = new URLSearchParams({
      limit: String(limit),
    });

    const response = await fetch(
      `${API_BASE}/ebay_featured.php?${params.toString()}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch featured eBay listings: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data?.success || !Array.isArray(data?.sections)) {
      return {
        success: false,
        sections: [],
      };
    }

    return data;
  } catch (error) {
    console.error("eBay Featured Fetch Error:", error);

    return {
      success: false,
      sections: [],
    };
  }
}

export async function fetchEbayCategories() {
  try {
    if (!API_BASE) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not configured."
      );
    }

    const response = await fetch(
      `${API_BASE}/ebay_categories.php`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch eBay categories: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data?.success || !Array.isArray(data?.categories)) {
      return {
        success: false,
        categories: [],
      };
    }

    return data;
  } catch (error) {
    console.error("eBay Categories Fetch Error:", error);

    return {
      success: false,
      categories: [],
    };
  }
}

export async function fetchEbayItem(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        item: null,
      };
    }

    if (!API_BASE) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not configured."
      );
    }

    const params = new URLSearchParams({
      id,
    });

    const response = await fetch(
      `${API_BASE}/ebay_item.php?${params.toString()}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch eBay item: ${response.status}`
      );
    }

    const data = await response.json();

    if (!data?.success || !data?.item) {
      return {
        success: false,
        item: null,
      };
    }

    return data;
  } catch (error) {
    console.error("eBay Item Fetch Error:", error);

    return {
      success: false,
      item: null,
    };
  }
}