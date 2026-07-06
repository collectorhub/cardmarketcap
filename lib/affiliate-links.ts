// lib/affiliate-links.ts

const EBAY_AFFILIATE_PARAMS = {
  mkevt: process.env.NEXT_PUBLIC_EBAY_MKEVT || "1",
  mkcid: process.env.NEXT_PUBLIC_EBAY_MKCID || "1",
  mkrid: process.env.NEXT_PUBLIC_EBAY_MKRID || "",
  campid: process.env.NEXT_PUBLIC_EBAY_CAMPID || "",
  toolid: process.env.NEXT_PUBLIC_EBAY_TOOLID || "10001",
};

export function buildEbayAffiliateUrl(
  rawUrl?: string | null,
  customId?: string | number | null
) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);

    if (!url.hostname.includes("ebay.com")) {
      return rawUrl;
    }

    Object.entries(EBAY_AFFILIATE_PARAMS).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    if (customId) {
      url.searchParams.set("customid", String(customId));
    }

    return url.toString();
  } catch {
    return rawUrl;
  }
}

export function buildTcgPlayerAffiliateUrl(
  rawUrl?: string | null,
  customId?: string | number | null
) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);

    // TCGPlayer affiliate params will go here once approved.
    // Example later:
    // url.searchParams.set("partner", process.env.NEXT_PUBLIC_TCGPLAYER_PARTNER_ID || "");
    // url.searchParams.set("customid", String(customId || ""));

    if (customId) {
      url.searchParams.set("customid", String(customId));
    }

    return url.toString();
  } catch {
    return rawUrl;
  }
}

export function getCardPurchaseLinks(card: any) {
  const customId = card.id || card.slug || card.canonical_path || card.name;

  const ebaySearchQuery = [
    card.name,
    card.set,
    card.number || card.card_number || card.cardNumber,
  ]
    .filter(Boolean)
    .join(" ");

  const fallbackEbayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
    ebaySearchQuery
  )}`;

  const ebayUrl = buildEbayAffiliateUrl(
    card.buy_url ||
      card.buyUrl ||
      card.ebay_url ||
      card.ebayUrl ||
      fallbackEbayUrl,
    customId
  );

  const tcgUrl = buildTcgPlayerAffiliateUrl(
    card.tcgplayer_url || card.tcgPlayerUrl || card.tcg_url || card.tcgUrl,
    customId
  );

  return [
    ebayUrl && {
      label: "Buy on eBay",
      marketplace: "eBay",
      url: ebayUrl,
    },
    tcgUrl && {
      label: "Buy on TCGPlayer",
      marketplace: "TCGPlayer",
      url: tcgUrl,
    },
  ].filter(Boolean);
}