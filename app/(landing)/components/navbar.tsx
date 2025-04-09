"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
export const Navbar = () => {
  const handleLogin = () => {
    // Redirects to your ASP.NET backend login URL
    window.location.href = "https://localhost:5274/account/login";
  };
  
  return (
    <div
      className="fixed top-0 w-full h-14 px-4 border-b-black-50 shadow-sm bg-white flex items-center"
      data-testid="navbar_wrapper"
    >
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <h1 className="text-md md:text-2xl text-neutral-800 font-bold">
          Taskify
        </h1>
        <div className="space-x-4 md:flex md:w-auto flex items-center justify-between">
          <Button onClick={handleLogin} className="px-4 py-2 rounded-md bg-black hover:bg-black/80 text-white font-semibold">
            Login
          </Button>
          <Button onClick={handleLogin} className="px-4 py-2 rounded-md bg-black hover:bg-black/80 text-white font-semibold hidden md:block">
            Get Taskify for free
          </Button>
        </div>
      </div>
    </div>
  );
};
