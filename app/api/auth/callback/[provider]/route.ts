// app/api/auth/callback/[provider]/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// HANDLE GET (Google, Discord, X)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  return handleOAuthLogic(code, provider, requestUrl.origin);
}

// HANDLE POST (Strictly for Apple)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  const formData = await request.formData();

  const code = formData.get("code") as string;
  const idToken = formData.get("id_token") as string;
  const user = formData.get("user") as string;

  const requestUrl = new URL(request.url);

  return handleOAuthLogic(
    code,
    provider,
    requestUrl.origin,
    user,
    idToken
  );
}

// SHARED LOGIC
async function handleOAuthLogic(
  code: string | null,
  provider: string,
  origin: string,
  appleUser?: string,
  appleIdToken?: string
) {
  if (!code) {
    return NextResponse.redirect(new URL('/sign-in?error=no_code', origin));
  }

  const redirect_uri = `${origin}/api/auth/callback/${provider}`;
  
  // Access the cookie store to get the PKCE verifier for Twitter
  const cookieStore = await cookies();
  const twitterVerifier = cookieStore.get('twitter_code_verifier')?.value;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth_handler.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        provider,
        redirect_uri,
        code_verifier: provider === "twitter" ? twitterVerifier : undefined,
        apple_user: appleUser,
        apple_id_token: appleIdToken,
      }),
    });

    // Check if the response is valid JSON
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Malformed JSON from PHP:", text);
      return NextResponse.redirect(new URL('/sign-in?error=internal_server_error', origin));
    }

    if (result.success) {
      const responseUrl = new URL('/auth/success', origin);
      responseUrl.searchParams.set('token', result.token);
      responseUrl.searchParams.set('user', JSON.stringify(result.user));
      return NextResponse.redirect(responseUrl, 303);
    } else {
      const signupUrl = new URL('/sign-up', origin);
      signupUrl.searchParams.set('error', result.message || 'auth_failed');
      return NextResponse.redirect(signupUrl, 303);
    }
  } catch (error) {
    console.error("Auth Fetch Error:", error);
    return NextResponse.redirect(new URL('/sign-in?error=server_error', origin));
  }
}