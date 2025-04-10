"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-4 px-6 border-t border-gray-100 bg-white/95 backdrop-blur-sm z-40"
    >
      <div className="md:max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center w-full justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Taskify
          </h1>
          <span className="text-gray-400 text-sm ml-2 hidden sm:inline-block">© {currentYear} All rights reserved</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 text-sm">
          <Link
            href="/privacy"
            className="px-3 py-1.5 text-gray-600 hover:text-violet-700 transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            href="/terms"
            className="px-3 py-1.5 text-gray-600 hover:text-violet-700 transition-colors duration-200"
          >
            Terms of Service
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            href="/contact"
            className="px-3 py-1.5 text-gray-600 hover:text-violet-700 transition-colors duration-200"
          >
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
          <span>by Taskify Team</span>
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-gray-400 md:hidden">
        © {currentYear} Taskify. All rights reserved
      </div>
    </motion.div>
  )
}

