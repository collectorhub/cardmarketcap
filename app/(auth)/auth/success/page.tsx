// app/(auth)/auth/success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from 'js-cookie'; // Add this import

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      // 1. Set LocalStorage (for the Navbar/UI state)
      localStorage.setItem("user_token", token);
      localStorage.setItem("user_data", decodeURIComponent(user));

      // 2. Set Cookie (for the Middleware/Protected Routes)
      // Set 'expires' to 7 days or match your PHP token expiry
      Cookies.set('user_token', token, { expires: 7, path: '/' });

      // 3. Sync and Redirect
      window.dispatchEvent(new Event("storage"));
      router.replace("/");
    } else {
      router.replace("/sign-up?error=Session data missing");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Completing sign-in...
    </div>
  );
}