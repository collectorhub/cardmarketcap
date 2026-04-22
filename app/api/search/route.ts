import { NextRequest, NextResponse } from 'next/server';
import { searchAssets, searchConfig } from '@/lib/searchAssets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = String(searchParams.get('q') || '').trim();
    const game = searchParams.get('game');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : searchConfig.DEFAULT_LIMIT;

    if (!q || q.length < searchConfig.MIN_QUERY_LENGTH) {
      return NextResponse.json(
        {
          query: q,
          normalized_query: q.trim().toLowerCase(),
          limit,
          game,
          results: [],
          message: `Query must be at least ${searchConfig.MIN_QUERY_LENGTH} characters.`,
        },
        { status: 200 }
      );
    }

    const data = await searchAssets({ q, game, limit });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Search API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to search assets.',
      },
      { status: 500 }
    );
  }
}
