// app/(auth)/auth/success/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from 'js-cookie';

// 1. Move the logic to a inner component
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      localStorage.setItem("user_token", token);
      localStorage.setItem("user_data", decodeURIComponent(user));
      Cookies.set('user_token', token, { expires: 7, path: '/' });
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

// 2. Wrap it in Suspense for the main export
export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}