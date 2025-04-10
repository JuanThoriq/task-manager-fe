"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  PlusCircle,
  FolderKanban,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const SidebarDashboard = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Home",
      icon: Home,
      href: "/home",
    },
    {
      title: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard/overview",
    },
    {
      title: "Calendar",
      icon: Calendar,
      href: "/dashboard/calendar",
    },
    {
      title: "Team",
      icon: Users,
      href: "/dashboard/team",
    },
  ];

  // const bottomMenuItems = [
  //   {
  //     title: "Settings",
  //     icon: Settings,
  //     href: "/dashboard/settings",
  //   },
  //   {
  //     title: "Help & Support",
  //     icon: HelpCircle,
  //     href: "/dashboard/help",
  //   },
  // ]

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-100 bg-white pt-16">
      <div className="flex flex-1 flex-col gap-2 p-4 overflow-auto">
        {/* <div className="mb-6">
          <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 py-5">
            <PlusCircle className="h-5 w-5" />
            <span>New Task</span>
          </Button>
        </div> */}

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-violet-600"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-violet-600" : "text-gray-400"
                    )}
                  />
                  {item.title}

                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="ml-auto h-2 w-2 rounded-full bg-violet-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          {/* <div className="rounded-lg bg-gray-50 p-3 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="text-sm font-medium">Your Progress</div>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">8 of 12 tasks completed</div>
          </div> */}

          {/* <nav className="space-y-1">
            {bottomMenuItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-violet-50 text-violet-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-violet-600",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-violet-600" : "text-gray-400")} />
                    {item.title}
                  </motion.div>
                </Link>
              )
            })}
          </nav> */}
        </div>
      </div>
    </aside>
  );
};
