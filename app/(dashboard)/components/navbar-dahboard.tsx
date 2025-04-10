"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { LogOut, Bell, Search, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import UserDisplay from "@/components/userDisplay"
import { MobileSidebar } from "@/components/mobile-sidebar"

export const NavbarDashboard = () => {
  const [searchFocused, setSearchFocused] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    // Redirects to your ASP.NET backend login URL
    window.location.href = "https://localhost:5274/account/logout"
  }

  return (
    <>
    <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 w-full h-16 px-4 border-b border-gray-100 shadow-sm bg-white/95 backdrop-blur-sm flex items-center z-50"
    >
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </Button>

          <Link href="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Taskify
            </h1>
          </Link>

          {/* <div
            className={`hidden md:flex items-center ml-8 relative ${searchFocused ? "w-80" : "w-64"} transition-all duration-300`}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-10 border-gray-200 focus:border-violet-300 rounded-full bg-gray-50 focus:bg-white transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div> */}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-500 hover:text-violet-600 hover:bg-violet-50"
          >
            <Search className="h-5 w-5 md:hidden" />
            <Bell className="h-5 w-5 hidden md:block" />
          </Button> */}

          <div className="flex items-center gap-3 mr-2">
            {/* <Avatar className="h-8 w-8 border border-gray-100">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-violet-100 text-violet-700">U</AvatarFallback>
            </Avatar> */}
            <UserDisplay />
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-full border border-gray-200 hover:border-violet-200 text-gray-700 hover:text-violet-700 font-medium transition-all duration-200 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
    </>
  )
}
