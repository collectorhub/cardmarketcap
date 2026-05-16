export function buildCardUrl(card: any) {
  let baseUrl =
    card.canonical_path ||
    card.canonicalUrl ||
    card.url ||
    card.href;

  // Fallback route
  if (!baseUrl) {
    return `/card/${card.card_id || card.id}`;
  }

  // Ensure leading slash
  if (!baseUrl.startsWith("/")) {
    baseUrl = `/${baseUrl}`;
  }

  // Ensure /card prefix
  if (!baseUrl.startsWith("/card")) {
    baseUrl = `/card${baseUrl}`;
  }

  return baseUrl;
}