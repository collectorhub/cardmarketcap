import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  // 1. Properly unwrap the Promise for Next.js 15+
  const resolvedParams = await params;
  const provider = resolvedParams.provider;
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/sign-in?error=no_code', request.url));
  }

  // 2. Generate the exact redirect_uri to send to PHP
  // This will automatically be localhost:3000 in dev, or your real domain in prod
  const redirect_uri = `${requestUrl.origin}/api/auth/callback/${provider}`;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth_handler.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 3. SEND ALL 3 REQUIRED FIELDS TO PHP
      body: JSON.stringify({ code, provider, redirect_uri }),
    });

    const result = await response.json();
    console.log("OAuth Result:", result); // Keep this to see what PHP says

   if (result.success) {
      const responseUrl = new URL('/auth/success', request.url);
      responseUrl.searchParams.set('token', result.token);
      responseUrl.searchParams.set('user', JSON.stringify(result.user));
      return NextResponse.redirect(responseUrl);
    } else {
      // REDIRECT TO SIGNUP with the specific message from PHP
      const signupUrl = new URL('/sign-up', request.url);
      signupUrl.searchParams.set('error', result.message || 'auth_failed');
      return NextResponse.redirect(signupUrl);
    }
  } catch (error) {
    console.error("Auth Fetch Error:", error);
  }

  return NextResponse.redirect(new URL('/sign-in?error=auth_failed', request.url));
}