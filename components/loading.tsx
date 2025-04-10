"use client"

import { motion } from "framer-motion"

export const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <motion.div
        className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
        style={{
          borderTop: "3px solid rgba(255, 255, 255, 0.3)",
          borderRight: "3px solid rgba(255, 255, 255, 0.3)",
          borderBottom: "3px solid rgba(255, 255, 255, 0.3)",
          borderLeft: "3px solid #fff",
        }}
        animate={{ rotate: 360 }}
        transition={{
          loop: Number.POSITIVE_INFINITY,
          duration: 0.75,
          ease: "linear",
        }}
      />
    </div>
  )
}
