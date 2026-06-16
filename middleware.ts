import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function verifyUserToken(token: string) {
  if (!API_BASE || !token) return null;

  try {
    const cleanToken = decodeURIComponent(token);

    const res = await fetch(
      `${API_BASE}/verify_token.php?token=${encodeURIComponent(cleanToken)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!data?.success || !data?.user) return null;

    return data.user;
  } catch (error) {
    console.error("Middleware token verify failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("user_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password");

  const isProtectedPage =
    pathname.startsWith("/overviewsss") ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/settings");

  const isAdminPage = pathname.startsWith("/admin");

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedPage && !token) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const user = await verifyUserToken(token);
    const role = String(user?.role || "").toLowerCase();

    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.svg).*)",
  ],
};