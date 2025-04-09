'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const NavbarDashboard = () => {
  const handleLogout = () => {
    // Redirects to your ASP.NET backend login URL
    window.location.href = "https://localhost:5274/account/logout";
  };
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b-black-50 shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <h1 className="text-md md:text-2xl text-neutral-800 font-bold">
          Taskify
        </h1>
        <div className="md:flex md:w-auto">
          <Button onClick={handleLogout} className="px-4 py-2 rounded-md bg-black hover:bg-black/80 text-white font-semibold">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
