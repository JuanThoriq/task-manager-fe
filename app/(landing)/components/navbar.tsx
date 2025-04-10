"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

export const Navbar = () => {
  const handleLogin = () => {
    // Redirects to your ASP.NET backend login URL
    window.location.href = "https://localhost:5274/account/login"
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 w-full h-16 px-4 border-b border-gray-100 shadow-sm bg-white/95 backdrop-blur-sm flex items-center z-50"
      data-testid="navbar_wrapper"
    >
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-300">
            Taskify
          </h1>
        </Link>

        <div className="space-x-3 md:space-x-4 flex items-center">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleLogin}
              className="px-4 py-2 rounded-full border border-gray-200 hover:border-violet-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 outline"
            >
              Login
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden md:block">
            <Button
              onClick={handleLogin}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
            >
              Get Taskify free <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="md:hidden">
            <Button
              onClick={handleLogin}
              size="icon"
              className="rounded-full w-10 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

