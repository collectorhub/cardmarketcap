import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the user is hitting the root path
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/overview', request.url))
  }
}

// Only run this middleware on the root path to keep performance high
export const config = {
  matcher: '/',
}