import type { SearchResponse, SearchResult } from '@/types/search';
import { query } from './mysql';

type SearchParams = {
  q: string;
  game?: string | null;
  limit?: number;
};

const MIN_QUERY_LENGTH = 2;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ');
}

function sanitizeLimit(limit?: number): number {
  const n = Number(limit || DEFAULT_LIMIT);
  if (!Number.isFinite(n)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(n, MAX_LIMIT));
}

function sanitizeGame(game?: string | null): string | null {
  if (!game) return null;
  const cleaned = normalizeSearchText(game).replace(/\s+/g, '');
  return cleaned || null;
}

/**
 * Comprehensive search scorer for cmc_assets.
 *
 * Ranking priorities:
 * 1. Exact card name match
 * 2. Prefix card name match
 * 3. Whole-word / contains card name match
 * 4. Prefix expansion name match
 * 5. Expansion code / card number support
 * 6. Shorter names first as a tie-breaker
 * 7. Stable alphabetic ordering for predictability
 */
export async function searchAssets(params: SearchParams): Promise<SearchResponse> {
  const rawQuery = String(params.q || '').trim();
  const normalizedQuery = normalizeSearchText(rawQuery);
  const normalizedGame = sanitizeGame(params.game);
  const limit = sanitizeLimit(params.limit);

  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    return {
      query: rawQuery,
      normalized_query: normalizedQuery,
      limit,
      game: normalizedGame,
      results: [],
    };
  }

  const sql = `
    SELECT
      asset_id,
      game,
      source_id,
      name,
      expansion_name,
      expansion_code,
      number,
      rarity,
      canonical_path,
      image_small,
      image_medium,
      image_large,
      (
        CASE
          WHEN LOWER(name) = LOWER(?) THEN 1000
          WHEN LOWER(name) LIKE LOWER(CONCAT(?, ' %')) THEN 960
          WHEN LOWER(name) LIKE LOWER(CONCAT(?, '%')) THEN 930
          WHEN LOWER(name) REGEXP LOWER(CONCAT('(^|[^a-z0-9])', REPLACE(?, ' ', '[[:space:]]+'), '([^a-z0-9]|$)')) THEN 900
          WHEN LOWER(name) LIKE LOWER(CONCAT('%', ?, '%')) THEN 820
          ELSE 0
        END
        + CASE
          WHEN LOWER(expansion_name) = LOWER(?) THEN 220
          WHEN LOWER(expansion_name) LIKE LOWER(CONCAT(?, '%')) THEN 180
          WHEN LOWER(expansion_name) LIKE LOWER(CONCAT('%', ?, '%')) THEN 120
          ELSE 0
        END
        + CASE
          WHEN LOWER(expansion_code) = LOWER(?) THEN 140
          WHEN LOWER(number) = LOWER(?) THEN 90
          WHEN LOWER(CONCAT(name, ' ', number)) LIKE LOWER(CONCAT('%', ?, '%')) THEN 60
          ELSE 0
        END
        + CASE
          WHEN game = ? THEN 35
          ELSE 0
        END
        - LEAST(CHAR_LENGTH(name), 80)
      ) AS score
    FROM cmc_assets
    WHERE
      (
        LOWER(name) LIKE LOWER(CONCAT('%', ?, '%'))
        OR LOWER(expansion_name) LIKE LOWER(CONCAT('%', ?, '%'))
        OR LOWER(expansion_code) LIKE LOWER(CONCAT('%', ?, '%'))
        OR LOWER(number) LIKE LOWER(CONCAT('%', ?, '%'))
        OR LOWER(CONCAT(name, ' ', IFNULL(number, ''))) LIKE LOWER(CONCAT('%', ?, '%'))
      )
      AND (? IS NULL OR game = ?)
    ORDER BY
      score DESC,
      CHAR_LENGTH(name) ASC,
      name ASC,
      expansion_name ASC,
      number ASC
    LIMIT ?
  `;

  const sqlParams = [
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedGame || '',
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedQuery,
    normalizedGame,
    normalizedGame,
    limit,
  ];

  const rows = (await query(sql, sqlParams)) as SearchResult[];

  return {
    query: rawQuery,
    normalized_query: normalizedQuery,
    limit,
    game: normalizedGame,
    results: rows,
  };
}

export const searchConfig = {
  MIN_QUERY_LENGTH,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
