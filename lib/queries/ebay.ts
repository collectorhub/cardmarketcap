"use server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export type EbayShopSection = "graded" | "raw" | "sealed" | "auction";
export type EbayShopSort =
  | "best_match"
  | "price_asc"
  | "price_desc"
  | "newly_listed"
  | "ending_soon";

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
}) {
  try {
    const params = new URLSearchParams({
      section,
      search,
      sort,
      limit: String(limit),
      offset: String(offset),
    });

    const response = await fetch(`${API_BASE}/ebay_shop.php?${params}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch eBay shop listings");
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.results)) {
      return {
        success: false,
        results: [],
        total: 0,
        count: 0,
        hasMore: false,
      };
    }

    return data;
  } catch (error) {
    console.error("eBay Shop Fetch Error:", error);

    return {
      success: false,
      results: [],
      total: 0,
      count: 0,
      hasMore: false,
    };
  }
}

export async function fetchEbayFeatured(limit = 8) {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
    });

    const response = await fetch(`${API_BASE}/ebay_featured.php?${params}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch featured eBay listings");
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.sections)) {
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
    const response = await fetch(`${API_BASE}/ebay_categories.php`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch eBay categories");
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.categories)) {
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

    const params = new URLSearchParams({
      id,
    });

    const response = await fetch(`${API_BASE}/ebay_item.php?${params}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch eBay item");
    }

    const data = await response.json();

    if (!data.success || !data.item) {
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