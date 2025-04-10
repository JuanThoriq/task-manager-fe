"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  LayoutList,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Users,
  Calendar,
} from "lucide-react"
import { Spinner } from "@/components/loading"

// Types
interface BoardStats {
  totalBoards: number
  totalLists: number
  totalCards: number
  completedCards: number
  recentActivity: {
    type: "board" | "list" | "card"
    action: "created" | "updated" | "deleted"
    title: string
    date: string
  }[]
}

export default function OverviewPage() {
  const [stats, setStats] = useState<BoardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      setLoading(true)
      // In a real app, you would fetch this data from your API
      // const res = await fetch("https://localhost:5274/api/v1/stats")
      // if (!res.ok) throw new Error("Failed to fetch statistics")
      // const data = await res.json()

      // For demo purposes, we'll use mock data
      const mockData: BoardStats = {
        totalBoards: 8,
        totalLists: 24,
        totalCards: 86,
        completedCards: 42,
        recentActivity: [
          { type: "card", action: "created", title: "Implement new feature", date: "2023-04-09T14:30:00Z" },
          { type: "list", action: "updated", title: "Development Tasks", date: "2023-04-08T10:15:00Z" },
          { type: "board", action: "created", title: "Q2 Planning", date: "2023-04-07T09:00:00Z" },
          { type: "card", action: "deleted", title: "Fix login bug", date: "2023-04-06T16:45:00Z" },
          { type: "card", action: "updated", title: "Update documentation", date: "2023-04-05T11:20:00Z" },
        ],
      }

      // Simulate API delay
      setTimeout(() => {
        setStats(mockData)
        setLoading(false)
      }, 1000)
    } catch (err: any) {
      console.error(err)
      setError("Error fetching statistics")
      setLoading(false)
    }
  }

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="p-6 pt-20 md:pt-24 max-w-7xl mx-auto">
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: "Total Boards",
      value: stats.totalBoards,
      icon: LayoutDashboard,
      color: "from-violet-500 to-indigo-500",
      bgLight: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Total Lists",
      value: stats.totalLists,
      icon: LayoutList,
      color: "from-indigo-500 to-blue-500",
      bgLight: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Total Cards",
      value: stats.totalCards,
      icon: CreditCard,
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Completed Cards",
      value: stats.completedCards,
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-500",
      bgLight: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ]

  const completionRate = Math.round((stats.completedCards / stats.totalCards) * 100) || 0

  return (
    <div className="p-6 pt-20 md:pt-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">Track your productivity and project statistics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bgLight} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700`}>
                  {index === 3 ? `${completionRate}%` : "Total"}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                {index === 3 && <span className="text-sm text-gray-500 mb-1">of {stats.totalCards}</span>}
              </div>
            </div>
            <div className={`h-1.5 w-full bg-gradient-to-r ${stat.color}`}></div>
          </motion.div>
        ))}
      </div>

      {/* Progress and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Completion Rate</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>

          <div className="flex flex-col items-center justify-center h-[220px]">
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  strokeDasharray={`${completionRate * 2.51}  251.2`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-800">{completionRate}%</span>
                <span className="text-sm text-gray-500">Completed</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {stats.completedCards} of {stats.totalCards} cards completed
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => {
              const IconComponent =
                activity.type === "board" ? LayoutDashboard : activity.type === "list" ? LayoutList : CreditCard

              const actionColor =
                activity.action === "created"
                  ? "text-emerald-600 bg-emerald-50"
                  : activity.action === "updated"
                    ? "text-blue-600 bg-blue-50"
                    : "text-red-600 bg-red-50"

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 truncate">{activity.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${actionColor} capitalize`}>
                        {activity.action}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(activity.date).toLocaleDateString()} at{" "}
                      {new Date(activity.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
