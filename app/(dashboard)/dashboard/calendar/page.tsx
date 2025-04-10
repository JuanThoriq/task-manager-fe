"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CreditCard,
  CheckCircle,
  X,
  Check,
} from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  addDays,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/loading"

// Types
interface CalendarTask {
  id: string
  title: string
  date: string
  listName: string
  completed: boolean
  priority: "low" | "medium" | "high"
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<CalendarTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [noteText, setNoteText] = useState("")
  const [notes, setNotes] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchTasks()
  }, [currentDate])

  async function fetchTasks() {
    try {
      setLoading(true)
      // In a real app, you would fetch tasks for the current month from your API
      // const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      // const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd')
      // const res = await fetch(`https://localhost:5274/api/v1/tasks?startDate=${startDate}&endDate=${endDate}`)
      // if (!res.ok) throw new Error("Failed to fetch tasks")
      // const data = await res.json()

      // For demo purposes, we'll use mock data
      const mockTasks: CalendarTask[] = [
        {
          id: "1",
          title: "Complete project proposal",
          date: "2023-04-05T10:00:00Z",
          listName: "Work Tasks",
          completed: true,
          priority: "high",
        },
        {
          id: "2",
          title: "Team meeting",
          date: "2023-04-10T14:30:00Z",
          listName: "Meetings",
          completed: false,
          priority: "medium",
        },
        {
          id: "3",
          title: "Review pull requests",
          date: "2023-04-12T09:00:00Z",
          listName: "Development",
          completed: false,
          priority: "medium",
        },
        {
          id: "4",
          title: "Update documentation",
          date: "2023-04-15T11:00:00Z",
          listName: "Documentation",
          completed: false,
          priority: "low",
        },
        {
          id: "5",
          title: "Client presentation",
          date: "2023-04-18T15:00:00Z",
          listName: "Meetings",
          completed: false,
          priority: "high",
        },
        {
          id: "6",
          title: "Code review",
          date: "2023-04-20T13:00:00Z",
          listName: "Development",
          completed: false,
          priority: "medium",
        },
        {
          id: "7",
          title: "Weekly report",
          date: "2023-04-21T16:00:00Z",
          listName: "Work Tasks",
          completed: false,
          priority: "medium",
        },
        {
          id: "8",
          title: "Deploy to production",
          date: "2023-04-25T09:00:00Z",
          listName: "Development",
          completed: false,
          priority: "high",
        },
        {
          id: "9",
          title: "Quarterly planning",
          date: "2023-04-28T10:00:00Z",
          listName: "Planning",
          completed: false,
          priority: "high",
        },
      ]

      // Simulate API delay
      setTimeout(() => {
        setTasks(mockTasks)
        setLoading(false)
      }, 1000)
    } catch (err: any) {
      console.error(err)
      setError("Error fetching tasks")
      setLoading(false)
    }
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToToday = () => setCurrentDate(new Date())

  const handleTaskClick = (task: CalendarTask) => {
    setSelectedTask(task)
  }

  const closeTaskDetails = () => {
    setSelectedTask(null)
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, completed: !selectedTask.completed })
    }
  }

  // Toggle date selection
  const toggleDateSelection = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")

    // Check if date is already selected
    const isSelected = selectedDates.some((selectedDate) => format(selectedDate, "yyyy-MM-dd") === dateString)

    if (isSelected) {
      // Remove date if already selected
      setSelectedDates(selectedDates.filter((selectedDate) => format(selectedDate, "yyyy-MM-dd") !== dateString))
    } else {
      // Add date if not selected
      setSelectedDates([...selectedDates, date])
    }
  }

  // Add note to a date
  const addNote = () => {
    if (selectedDates.length > 0 && noteText.trim()) {
      const dateString = format(selectedDates[selectedDates.length - 1], "yyyy-MM-dd")
      setNotes({
        ...notes,
        [dateString]: noteText,
      })
      setNoteText("")
    }
  }

  // Generate days for the current month view
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart)

  // Calculate days from previous month to fill the first row
  const prevMonthDays = Array.from({ length: startDay }).map((_, i) => {
    return addDays(monthStart, -startDay + i)
  })

  // Calculate how many days we need from the next month
  const totalDaysDisplayed = Math.ceil((monthDays.length + startDay) / 7) * 7
  const nextMonthDaysCount = totalDaysDisplayed - monthDays.length - startDay

  // Get days from next month
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }).map((_, i) => {
    return addDays(monthEnd, i + 1)
  })

  // Combine all days
  const calendarDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]

  // Group tasks by date
  const tasksByDate: Record<string, CalendarTask[]> = {}
  tasks.forEach((task) => {
    const dateKey = task.date.split("T")[0] // Extract YYYY-MM-DD part
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = []
    }
    tasksByDate[dateKey].push(task)
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return selectedDates.some((selectedDate) => format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
  }

  // Check if a date has a note
  const getDateNote = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return notes[dateString]
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

  return (
    <div className="p-6 pt-20 md:pt-24 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
          Calendar
        </h1>
        <p className="text-gray-500 mt-1">Select dates and add notes</p>
      </motion.div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-9 w-9 rounded-full border-gray-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-800">{format(currentDate, "MMMM yyyy")}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-9 w-9 rounded-full border-gray-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={goToToday}
          variant="outline"
          className="border-gray-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0 border-gray-200"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd")
            const dayTasks = tasksByDate[dateKey] || []
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const isSelected = isDateSelected(day)
            const hasNote = !!getDateNote(day)

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                onClick={() => toggleDateSelection(day)}
                className={`min-h-[100px] p-2 border-r border-b last:border-r-0 relative cursor-pointer
                  ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                  ${isSelected ? "ring-2 ring-violet-300 ring-inset" : ""}
                  hover:bg-gray-50 transition-colors duration-150
                `}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-sm font-medium 
                      ${isCurrentMonth ? (isToday ? "bg-violet-600 text-white w-6 h-6 rounded-full flex items-center justify-center" : "text-gray-800") : "text-gray-400"}
                    `}
                  >
                    {format(day, "d")}
                  </span>

                  {isSelected && (
                    <span className="h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-violet-600" />
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTaskClick(task)}
                      className={`px-2 py-1 rounded text-xs cursor-pointer ${
                        task.completed
                          ? "bg-gray-100 text-gray-500 line-through"
                          : "bg-violet-50 text-violet-800 hover:bg-violet-100"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }`}
                        ></div>
                        <span className="truncate">{task.title}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {hasNote && (
                  <div className="mt-1 p-1 bg-violet-50 rounded text-xs text-violet-700 line-clamp-3">
                    {getDateNote(day)}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Note</h3>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            {selectedDates.length === 0
              ? "Select a date to add a note"
              : `Adding note to: ${selectedDates.map((date) => format(date, "MMM d")).join(", ")}`}
          </p>

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter your note here..."
            disabled={selectedDates.length === 0}
            className="w-full min-h-[100px] rounded-md border border-gray-300 p-3 text-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={addNote}
            disabled={selectedDates.length === 0 || !noteText.trim()}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
          >
            Add Note
          </Button>
        </div>
      </div>

      {/* Selected Dates Summary */}
      {selectedDates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-violet-50 rounded-xl border border-violet-200 p-4"
        >
          <h3 className="text-lg font-semibold text-violet-800 mb-2">Selected Dates</h3>
          <div className="flex flex-wrap gap-2">
            {selectedDates.map((date, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-white rounded-full border border-violet-200 text-sm text-violet-700 flex items-center gap-1"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {format(date, "MMM d, yyyy")}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleDateSelection(date)
                  }}
                  className="ml-1 h-4 w-4 rounded-full bg-violet-100 flex items-center justify-center hover:bg-violet-200"
                >
                  <ChevronRight className="h-3 w-3 rotate-45 text-violet-600" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Task Details Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              onClick={closeTaskDetails}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-lg bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-violet-600" />
                  Task Details
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100"
                  onClick={closeTaskDetails}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{selectedTask.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(selectedTask.priority)} capitalize`}
                  >
                    {selectedTask.priority}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(selectedTask.date).toLocaleDateString()} at{" "}
                      {new Date(selectedTask.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>List: {selectedTask.listName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={
                        selectedTask.completed
                          ? "text-emerald-600 flex items-center gap-1"
                          : "text-amber-600 flex items-center gap-1"
                      }
                    >
                      {selectedTask.completed ? (
                        <>
                          <CheckCircle className="h-4 w-4" /> Completed
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4" /> In Progress
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 p-4">
                <Button variant="outline" onClick={closeTaskDetails}>
                  Close
                </Button>
                <Button
                  onClick={() => toggleTaskCompletion(selectedTask.id)}
                  className={
                    selectedTask.completed
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                  }
                >
                  {selectedTask.completed ? "Mark as Incomplete" : "Mark as Complete"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
