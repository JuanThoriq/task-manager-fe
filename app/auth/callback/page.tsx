"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import dynamic from "next/dynamic";

// ⛔ SSR OFF
const AnimatedLoader = dynamic(() => import("@/components/animatedLoader"), {
  ssr: true,
});

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

 useEffect(() => {
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const picture = searchParams.get("picture"); // ✅ Get it from the URL

  if (email) {
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name || "User");
    localStorage.setItem("userPicture", picture || "/placeholder.svg"); // ✅ Save fallback
    console.log("✅ Logged in as:", name || "User", picture);

    router.push("/home");
  } else {
    router.push("/");
  }
}, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      <AnimatedLoader />
      <h2 className="text-lg font-medium text-gray-800 mt-4">Just a sec...</h2>
      <p className="text-sm text-gray-500">Logging you in with Google</p>
    </div>
  );
}
