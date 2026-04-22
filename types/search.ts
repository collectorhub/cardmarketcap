export type SearchGame =
  | 'pokemon'
  | 'mtg'
  | 'lorcana'
  | 'onepiece'
  | 'gundam'
  | 'riftbound';

export type SearchResult = {
  asset_id: number;
  game: SearchGame | string;
  source_id: string;
  name: string;
  expansion_name: string | null;
  expansion_code: string | null;
  number: string | null;
  rarity: string | null;
  canonical_path: string;
  image_small: string | null;
  image_medium: string | null;
  image_large: string | null;
  score: number;
};

export type SearchResponse = {
  query: string;
  normalized_query: string;
  limit: number;
  game: string | null;
  results: SearchResult[];
};