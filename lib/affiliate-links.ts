// lib/affiliate-links.ts

export type PurchaseMarketplace = "ebay" | "tcgplayer";

export type PurchaseLink = {
  label: string;
  marketplace: PurchaseMarketplace;
  url: string;
  description: string;
};

export type PurchaseLinkContext = {
  placement?: string;
  component?: string;
};

const EBAY_AFFILIATE_PARAMS = {
  mkevt: process.env.NEXT_PUBLIC_EBAY_MKEVT || "1",
  mkcid: process.env.NEXT_PUBLIC_EBAY_MKCID || "1",
  mkrid: process.env.NEXT_PUBLIC_EBAY_MKRID || "",
  campid: process.env.NEXT_PUBLIC_EBAY_CAMPID || "",
  toolid: process.env.NEXT_PUBLIC_EBAY_TOOLID || "10001",
};

/**
 * This is the full Impact/TCGplayer tracking URL—not the vanity URL.
 *
 * The values are public affiliate identifiers already visible in tracking
 * links, not private API credentials. Keeping them in environment variables
 * makes staging and production configuration easier.
 */
const TCGPLAYER_AFFILIATE_TRACKING_URL =
  process.env.NEXT_PUBLIC_TCGPLAYER_AFFILIATE_TRACKING_URL ||
  "https://partner.tcgplayer.com/c/7456570/1780961/21018";

const TCGPLAYER_PRODUCT_LINE =
  process.env.NEXT_PUBLIC_TCGPLAYER_PRODUCT_LINE || "pokemon";

const cleanTrackingValue = (
  value: unknown,
  fallback = ""
): string => {
  const cleaned = String(value ?? fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);

  return cleaned || fallback;
};

const getCardIdentifier = (card: any): string => {
  const rawIdentifier =
    card?.id ||
    card?.source_id ||
    card?.slug ||
    card?.canonical_path ||
    card?.canonicalUrl ||
    card?.number ||
    card?.card_number ||
    card?.cardNumber ||
    card?.name ||
    "unknown_card";

  return cleanTrackingValue(rawIdentifier, "unknown_card");
};

const getCardSearchQuery = (card: any): string =>
  [
    card?.name,
    card?.set,
    card?.set_name,
    card?.expansion_name,
    card?.number ||
      card?.card_number ||
      card?.cardNumber,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter(Boolean)
    .join(" ");

const isAllowedMarketplaceUrl = (
  rawUrl: string,
  hostnameFragment: string
): boolean => {
  try {
    const url = new URL(rawUrl);

    return (
      url.protocol === "https:" &&
      (url.hostname === hostnameFragment ||
        url.hostname.endsWith(`.${hostnameFragment}`))
    );
  } catch {
    return false;
  }
};

export function buildEbayAffiliateUrl(
  rawUrl?: string | null,
  customId?: string | number | null
): string | null {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);

    if (
      !url.hostname.includes("ebay.com") &&
      !url.hostname.includes("ebay.co.uk")
    ) {
      return rawUrl;
    }

    Object.entries(EBAY_AFFILIATE_PARAMS).forEach(
      ([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      }
    );

    if (customId) {
      url.searchParams.set(
        "customid",
        cleanTrackingValue(customId)
      );
    }

    return url.toString();
  } catch {
    return rawUrl;
  }
}

/**
 * Builds a production Impact deep link to a specific TCGplayer destination.
 *
 * Impact's `u` parameter contains the URL-encoded TCGplayer landing page.
 * SubId1–3 are used only for CardMarketCap's partner-side reporting.
 */
export function buildTcgPlayerAffiliateUrl({
  destinationUrl,
  placement = "market_table",
  component = "buy_modal",
  cardId = "unknown_card",
}: {
  destinationUrl: string;
  placement?: string;
  component?: string;
  cardId?: string | number | null;
}): string | null {
  if (
    !destinationUrl ||
    !isAllowedMarketplaceUrl(
      destinationUrl,
      "tcgplayer.com"
    )
  ) {
    return null;
  }

  try {
    const trackingUrl = new URL(
      TCGPLAYER_AFFILIATE_TRACKING_URL
    );

    if (
      trackingUrl.protocol !== "https:" ||
      trackingUrl.hostname !==
        "partner.tcgplayer.com"
    ) {
      return null;
    }

    trackingUrl.searchParams.set(
      "u",
      destinationUrl
    );

    trackingUrl.searchParams.set(
      "subId1",
      cleanTrackingValue(
        placement,
        "market_table"
      )
    );

    trackingUrl.searchParams.set(
      "subId2",
      cleanTrackingValue(
        component,
        "buy_modal"
      )
    );

    trackingUrl.searchParams.set(
      "subId3",
      cleanTrackingValue(
        cardId,
        "unknown_card"
      )
    );

    return trackingUrl.toString();
  } catch {
    return null;
  }
}

export function getCardPurchaseLinks(
  card: any,
  context: PurchaseLinkContext = {}
): PurchaseLink[] {
  const customId = getCardIdentifier(card);
  const searchQuery = getCardSearchQuery(card);

  const fallbackEbayUrl =
    `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
      searchQuery
    )}`;

  const ebayUrl = buildEbayAffiliateUrl(
    card?.buy_url ||
      card?.buyUrl ||
      card?.ebay_url ||
      card?.ebayUrl ||
      fallbackEbayUrl,
    customId
  );

  const fallbackTcgUrl = new URL(
    `https://www.tcgplayer.com/search/${TCGPLAYER_PRODUCT_LINE}/product`
  );

  fallbackTcgUrl.searchParams.set(
    "productLineName",
    TCGPLAYER_PRODUCT_LINE
  );
  fallbackTcgUrl.searchParams.set(
    "q",
    searchQuery
  );
  fallbackTcgUrl.searchParams.set(
    "view",
    "grid"
  );

  const rawTcgDestination =
    card?.tcgplayer_url ||
    card?.tcgPlayerUrl ||
    card?.tcg_url ||
    card?.tcgUrl ||
    fallbackTcgUrl.toString();

  const tcgUrl = buildTcgPlayerAffiliateUrl({
    destinationUrl: rawTcgDestination,
    placement:
      context.placement || "market_table",
    component:
      context.component || "buy_modal",
    cardId: customId,
  });

  return [
    ebayUrl
      ? {
          label: "Buy on eBay",
          marketplace: "ebay" as const,
          url: ebayUrl,
          description:
            "Browse live listings, auctions and seller offers.",
        }
      : null,
    tcgUrl
      ? {
          label: "Buy on TCGplayer",
          marketplace: "tcgplayer" as const,
          url: tcgUrl,
          description:
            "Browse singles, conditions and marketplace offers.",
        }
      : null,
  ].filter(
    (link): link is PurchaseLink =>
      Boolean(link)
  );
}
