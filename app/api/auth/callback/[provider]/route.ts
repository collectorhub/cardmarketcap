import { NextResponse } from 'next/server';

type RouteContext = {
  params: {
    provider: string;
  };
};

// ======================================================
// GET HANDLER (Google, Facebook, Twitter)
// ======================================================

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { provider } = params;

  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/sign-in?error=no_code', request.url)
    );
  }

  try {

    // IMPORTANT:
    // Build EXACT redirect_uri used during OAuth login
    const redirect_uri =
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${provider}`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth_handler.php`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          provider,
          redirect_uri,
        }),
      }
    );

    const result = await response.json();

    console.log('OAuth Result:', result);

    if (result.success) {

      const responseUrl = new URL('/auth/success', request.url);

      responseUrl.searchParams.set('token', result.token);

      responseUrl.searchParams.set(
        'user',
        encodeURIComponent(JSON.stringify(result.user))
      );

      return NextResponse.redirect(responseUrl);
    }

    console.error('OAuth Failed:', result);

  } catch (error) {

    console.error('Auth Error:', error);

  }

  return NextResponse.redirect(
    new URL('/sign-in?error=auth_failed', request.url)
  );
}

// ======================================================
// POST HANDLER (Apple)
// ======================================================

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  const { provider } = params;

  const formData = await request.formData();

  const code = formData.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/sign-in?error=no_code', request.url)
    );
  }

  try {

    const redirect_uri =
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${provider}`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth_handler.php`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.toString(),
          provider,
          redirect_uri,
        }),
      }
    );

    const result = await response.json();

    console.log('Apple OAuth Result:', result);

    if (result.success) {

      const responseUrl = new URL('/auth/success', request.url);

      responseUrl.searchParams.set('token', result.token);

      responseUrl.searchParams.set(
        'user',
        encodeURIComponent(JSON.stringify(result.user))
      );

      return NextResponse.redirect(responseUrl);
    }

    console.error('Apple OAuth Failed:', result);

  } catch (error) {

    console.error('Apple POST Error:', error);

  }

  return NextResponse.redirect(
    new URL('/sign-in?error=auth_failed', request.url)
  );
}