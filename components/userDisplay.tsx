"use client";

import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UserDisplay() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPicture, setUserPicture] = useState("/placeholder.svg");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPicture = localStorage.getItem("userPicture");

    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
    if (storedPicture) setUserPicture(storedPicture);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setTooltipOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTooltip = () => {
    setTooltipOpen((prev) => !prev);
  };

  return (
    <div className="relative flex items-center gap-2" ref={tooltipRef}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleTooltip}
      >
        <Avatar className="h-8 w-8 border border-gray-100">
          <AvatarImage src={userPicture} />
          <AvatarFallback className="bg-violet-100 text-violet-700">
            {userName ? userName.charAt(0) : "U"}
          </AvatarFallback>
        </Avatar>

        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {userName || "Guest"}
        </span>
      </div>

      {tooltipOpen && (
        <div className="absolute z-10 top-10 left-1/2 -translate-x-1/2 flex flex-col px-4 py-2 rounded-md bg-white shadow-md border w-max max-w-[90vw] break-words text-sm">
          <span className="font-semibold text-gray-900">
            {userName || "Guest"}
          </span>
          <span className="text-gray-600">
            {userEmail || "Not signed in"}
          </span>
        </div>
      )}
    </div>
  );
}
