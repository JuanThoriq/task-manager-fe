"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  PlusCircle,
  FolderKanban,
  BarChart3,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const pathname = usePathname()

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
  ]

  const bottomMenuItems = [
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      href: "/dashboard/help",
    },
  ]

  const handleLogout = () => {
    // Redirects to your ASP.NET backend logout URL
    window.location.href = "https://localhost:5274/account/logout"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-0 top-0 z-50 h-full w-[280px] bg-white shadow-xl overflow-hidden flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  T
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Taskify
                </h1>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>

            {/* <div className="p-4">
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-violet-100 text-violet-700">U</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">User Name</div>
                  <div className="text-xs text-gray-500">user@example.com</div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 py-5 mb-6">
                <PlusCircle className="h-5 w-5" />
                <span>New Task</span>
              </Button>
            </div> */}

            <div className="flex-1 overflow-y-auto px-4">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-violet-50 text-violet-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-violet-600",
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", isActive ? "text-violet-600" : "text-gray-400")} />
                        {item.title}

                        {isActive && (
                          <motion.div
                            layoutId="mobile-sidebar-indicator"
                            className="ml-auto h-2 w-2 rounded-full bg-violet-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}
              </nav>

              {/* <div className="my-4">
                <div className="rounded-lg bg-gray-50 p-3 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="text-sm font-medium">Your Progress</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">8 of 12 tasks completed</div>
                </div>
              </div> */}

              {/* <nav className="space-y-1">
                {bottomMenuItems.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
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

            {/* <div className="p-4 border-t border-gray-100">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start rounded-lg border border-gray-200 hover:border-violet-200 text-gray-700 hover:text-violet-700 font-medium transition-all duration-200 flex items-center gap-3"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div> */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

