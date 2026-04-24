import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get('user_token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define our path groups
  const isAuthPage = pathname.startsWith('/sign-in') || 
                     pathname.startsWith('/sign-up') || 
                     pathname.startsWith('/forgot-password');

  const isProtectedPage = pathname.startsWith('/overview') || 
                          pathname.startsWith('/portfolio') || 
                          pathname.startsWith('/settings');

  // 3. SCENARIO A: Authenticated user trying to access login/signup
  // Redirect them to the home page
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. SCENARIO B: Guest trying to access protected pages
  // Redirect them to login
  if (isProtectedPage && !token) {
    const loginUrl = new URL('/sign-in', request.url);
    // Optional: Keep track of where they were trying to go
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 5. Matcher Configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (logo.png, icons, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.svg).*)',
  ],
};