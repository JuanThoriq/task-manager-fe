"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email");
    const name = searchParams.get("name");

    if (email) {
      // Optionally save to localStorage or context
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name || "User");
      console.log("✅ Logged in as:", name || "User");
      console.log("✅ Logged in as:", email);

      // Redirect to home
      router.push("/home");
    } else {
      // Optional: handle error if no email
      router.push("/");
    }
  }, [searchParams, router]);

  return <p>Logging in... Please wait.</p>;
}
