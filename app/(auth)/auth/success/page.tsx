"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccessPage() {

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {

    const token = searchParams.get("token");

    const user = searchParams.get("user");

    if (token && user) {

      localStorage.setItem("user_token", token);

      localStorage.setItem(
        "user_data",
        decodeURIComponent(user)
      );

      window.dispatchEvent(new Event("storage"));

      router.replace("/");

    } else {

      router.replace("/sign-in?error=missing_auth_data");

    }

  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in...
    </div>
  );
}