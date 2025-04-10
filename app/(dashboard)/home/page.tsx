"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle, Pencil, Trash2, Loader2, AlertCircle, Layout, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/loading"

// Board interface
interface Board {
  boardId: string
  orgId: string
  title: string
  createdAt: string
  updatedAt: string
}

// Custom Modal Component
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  footer: React.ReactNode
}

const Modal = ({ isOpen, onClose, title, icon, children, footer }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-lg bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {icon}
                {title}
              </h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">{children}</div>
            <div className="flex justify-end gap-2 border-t border-gray-100 p-4">{footer}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Custom Alert Component
interface CustomAlertProps {
  variant?: "default" | "destructive"
  icon?: React.ReactNode
  children: React.ReactNode
}

const CustomAlert = ({ variant = "default", icon, children }: CustomAlertProps) => {
  const bgColor = variant === "destructive" ? "bg-red-50" : "bg-violet-50"
  const textColor = variant === "destructive" ? "text-red-800" : "text-violet-800"
  const borderColor = variant === "destructive" ? "border-red-200" : "border-violet-200"

  return (
    <div className={`flex items-start gap-3 rounded-lg border ${borderColor} ${bgColor} p-4`}>
      {icon}
      <div className={`text-sm ${textColor}`}>{children}</div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // State for Add Board modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState("")
  const [isAddingBoard, setIsAddingBoard] = useState(false)

  // State for Update Board modal
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateBoardTitle, setUpdateBoardTitle] = useState("")
  const [selectedBoardId, setSelectedBoardId] = useState("")
  const [isUpdatingBoard, setIsUpdatingBoard] = useState(false)

  // State for Delete Board modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteBoardId, setDeleteBoardId] = useState("")
  const [isDeletingBoard, setIsDeletingBoard] = useState(false)

  useEffect(() => {
    fetchBoards()
  }, [])

  // Auto redirect after error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("")
        router.push("/home")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, router])

  // Fetch boards via GET
  const fetchBoards = async () => {
    try {
      setLoading(true)
      const res = await fetch(`https://localhost:5274/api/v1/boards?orgId=1`)
      if (!res.ok) {
        throw new Error("Failed to fetch boards")
      }
      const data = await res.json()
      setBoards(data)
      setLoading(false)
    } catch (err: any) {
      console.error(err)
      setError("Error fetching boards")
      setLoading(false)
    }
  }

  // Handle Create Board
  const handleAddBoard = async () => {
    if (!newBoardTitle || newBoardTitle.length < 3) {
      setError("Board title must be at least 3 characters long.")
      return
    }

    try {
      setIsAddingBoard(true)
      const res = await fetch("https://localhost:5274/api/v1/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: "1", title: newBoardTitle }),
      })
      if (!res.ok) {
        throw new Error("Failed to create board")
      }
      // Refresh boards
      await fetchBoards()
      // Reset state
      setNewBoardTitle("")
      setShowAddModal(false)
    } catch (err: any) {
      console.error(err)
      setError("Error creating board")
    } finally {
      setIsAddingBoard(false)
    }
  }

  // Open Update Modal
  const openUpdateModal = (boardId: string, currentTitle: string) => {
    setSelectedBoardId(boardId)
    setUpdateBoardTitle(currentTitle)
    setShowUpdateModal(true)
  }

  // Handle Update Board
  const handleUpdateBoard = async () => {
    if (!updateBoardTitle || updateBoardTitle.length < 3 || !selectedBoardId) {
      setError("Board title must be at least 3 characters long.")
      return
    }

    try {
      setIsUpdatingBoard(true)
      const res = await fetch(`https://localhost:5274/api/v1/boards/${selectedBoardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: selectedBoardId,
          title: updateBoardTitle,
        }),
      })
      if (!res.ok) {
        throw new Error("Failed to update board")
      }
      await fetchBoards()
      setShowUpdateModal(false)
    } catch (err: any) {
      console.error(err)
      setError("Error updating board")
    } finally {
      setIsUpdatingBoard(false)
    }
  }

  // Open Delete Modal
  const openDeleteModal = (boardId: string) => {
    setDeleteBoardId(boardId)
    setShowDeleteModal(true)
  }

  // Handle Delete Board
  const handleDeleteBoard = async () => {
    if (!deleteBoardId) return

    try {
      setIsDeletingBoard(true)
      const res = await fetch(`https://localhost:5274/api/v1/boards/${deleteBoardId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        throw new Error("Failed to delete board")
      }
      await fetchBoards()
      setShowDeleteModal(false)
    } catch (err: any) {
      console.error(err)
      setError("Error deleting board")
    } finally {
      setIsDeletingBoard(false)
    }
  }

  // Navigate to BoardPage when board is clicked
  const handleBoardClick = (boardId: string) => {
    router.push(`/board/${boardId}`)
  }

  if (loading) return <Spinner />

  return (
    <div className="px-6 pt-20 pb-16 md:pt-24 max-w-7xl mx-auto space-y-10">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <CustomAlert variant="destructive" icon={<AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}>
              {error}
            </CustomAlert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
            Your Boards
          </h1>
          <p className="text-gray-500 mt-1">Manage and organize your projects</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            size="lg"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Board</span>
          </Button>
        </motion.div>
      </div>

      {boards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 border border-gray-100 rounded-xl p-10 text-center"
        >
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layout className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No boards yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Create your first board to start organizing your tasks and projects.
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Your First Board
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board, index) => (
            <motion.div
              key={board.boardId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div
                className="h-32 bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center cursor-pointer"
                onClick={() => handleBoardClick(board.boardId)}
              >
                <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Layout className="h-6 w-6 text-violet-600" />
                </div>
              </div>
              <div className="p-5">
                <h2
                  className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-violet-700 transition-colors"
                  onClick={() => handleBoardClick(board.boardId)}
                >
                  {board.title}
                </h2>
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <span>Created {new Date(board.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-violet-700 hover:bg-violet-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      openUpdateModal(board.boardId, board.title)
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDeleteModal(board.boardId)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ADD BOARD MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Board"
        icon={<PlusCircle className="h-5 w-5 text-violet-600" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddBoard}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              disabled={isAddingBoard || newBoardTitle.length < 3}
            >
              {isAddingBoard ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Board
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="py-2">
          <label htmlFor="boardTitle" className="text-sm font-medium text-gray-700 block mb-2">
            Board Title
          </label>
          <Input
            id="boardTitle"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Enter board title"
            className="w-full"
            autoFocus
          />
          {newBoardTitle.length > 0 && newBoardTitle.length < 3 && (
            <p className="text-sm text-red-500 mt-1">Title must be at least 3 characters long</p>
          )}
        </div>
      </Modal>

      {/* UPDATE BOARD MODAL */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Edit Board"
        icon={<Pencil className="h-5 w-5 text-violet-600" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBoard}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              disabled={isUpdatingBoard || updateBoardTitle.length < 3}
            >
              {isUpdatingBoard ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update Board
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="py-2">
          <label htmlFor="updateBoardTitle" className="text-sm font-medium text-gray-700 block mb-2">
            Board Title
          </label>
          <Input
            id="updateBoardTitle"
            value={updateBoardTitle}
            onChange={(e) => setUpdateBoardTitle(e.target.value)}
            placeholder="Enter board title"
            className="w-full"
            autoFocus
          />
          {updateBoardTitle.length > 0 && updateBoardTitle.length < 3 && (
            <p className="text-sm text-red-500 mt-1">Title must be at least 3 characters long</p>
          )}
        </div>
      </Modal>

      {/* DELETE BOARD MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Board"
        icon={<Trash2 className="h-5 w-5 text-red-500" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBoard}
              disabled={isDeletingBoard}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingBoard ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Board
                </>
              )}
            </Button>
          </>
        }
      >
        <CustomAlert variant="destructive" icon={<AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}>
          Are you sure you want to delete this board? This action cannot be undone.
        </CustomAlert>
      </Modal>
    </div>
  )
}
