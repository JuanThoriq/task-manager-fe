"use client"

import { useRouter, useParams } from "next/navigation"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PlusCircle,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  LayoutList,
  CreditCard,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/loading"
import { CardList } from "./components/card-list"

// Types
interface BoardDetail {
  boardId: string
  orgId: string
  title: string
  createdAt: string
  updatedAt: string
}

interface Card {
  cardId: string
  title: string
  order: number
  description?: string
  listId: string
  createdAt: string
  updatedAt: string
}

interface ListData {
  listId: string
  title: string
  order: number
  boardId: string
  createdAt: string
  updatedAt: string
  cards: Card[]
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

export default function BoardPage() {
  const router = useRouter()
  const params = useParams()
  const boardId = params.boardId as string

  const [boardDetail, setBoardDetail] = useState<BoardDetail | null>(null)
  const [lists, setLists] = useState<ListData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // State for Add List modal
  const [showAddListModal, setShowAddListModal] = useState(false)
  const [newListTitle, setNewListTitle] = useState("")
  const [newListOrder, setNewListOrder] = useState<number>(0)
  const [isAddingList, setIsAddingList] = useState(false)

  // State for Update List modal
  const [showUpdateListModal, setShowUpdateListModal] = useState(false)
  const [selectedListId, setSelectedListId] = useState("")
  const [updateListTitle, setUpdateListTitle] = useState("")
  const [updateListOrder, setUpdateListOrder] = useState<number>(0)
  const [isUpdatingList, setIsUpdatingList] = useState(false)

  // State for Delete List modal
  const [showDeleteListModal, setShowDeleteListModal] = useState(false)
  const [deleteListId, setDeleteListId] = useState("")
  const [isDeletingList, setIsDeletingList] = useState(false)

  // State for Add Card modal
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [newCardDesc, setNewCardDesc] = useState("")
  const [newCardOrder, setNewCardOrder] = useState<number>(0)
  const [addCardListId, setAddCardListId] = useState("")
  const [isAddingCard, setIsAddingCard] = useState(false)

  // State for Update Card modal
  const [showUpdateCardModal, setShowUpdateCardModal] = useState(false)
  const [updateCardId, setUpdateCardId] = useState("")
  const [updateCardTitle, setUpdateCardTitle] = useState("")
  const [updateCardDesc, setUpdateCardDesc] = useState("")
  const [updateCardOrder, setUpdateCardOrder] = useState<number>(0)
  const [isUpdatingCard, setIsUpdatingCard] = useState(false)

  // State for Delete Card modal
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false)
  const [deleteCardId, setDeleteCardId] = useState("")
  const [isDeletingCard, setIsDeletingCard] = useState(false)

  // Fetch Lists & Cards
  useEffect(() => {
    if (!boardId) return
    fetchBoardDetail()
    fetchLists()
  }, [boardId])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("")
        router.push(`/board/${boardId}`)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, router, boardId])

  async function fetchBoardDetail() {
    try {
      const res = await fetch(`https://localhost:5274/api/v1/boards/${boardId}`)
      if (!res.ok) throw new Error("Failed to fetch board details")
      const data = await res.json()
      setBoardDetail(data)
    } catch (err: any) {
      console.error(err)
      setError("Error fetching board details")
    }
  }

  async function fetchLists() {
    try {
      setLoading(true)
      setError("")
      const res = await fetch(`https://localhost:5274/api/v1/boards/${boardId}/lists`)
      if (!res.ok) {
        throw new Error("Failed to fetch lists")
      }
      const data = await res.json()
      setLists(data)
      setLoading(false)
    } catch (err: any) {
      console.error(err)
      setError("Error fetching lists and cards")
      setLoading(false)
    }
  }

  // ============= LIST CRUD =============
  async function handleAddList() {
    if (!newListTitle || newListTitle.length < 3) {
      setError("List title must be at least 3 characters.")
      return
    }
    try {
      setIsAddingList(true)
      const res = await fetch(`https://localhost:5274/api/v1/boards/${boardId}/lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: boardId,
          title: newListTitle,
          order: newListOrder,
        }),
      })
      if (!res.ok) throw new Error("Failed to add list")
      setShowAddListModal(false)
      setNewListTitle("")
      setNewListOrder(0)
      await fetchLists()
    } catch (err: any) {
      console.error(err)
      setError("Error adding list")
    } finally {
      setIsAddingList(false)
    }
  }

  function openUpdateListModal(list: ListData) {
    setSelectedListId(list.listId)
    setUpdateListTitle(list.title)
    setUpdateListOrder(list.order)
    setShowUpdateListModal(true)
  }
  

  async function handleUpdateList() {
    if (!updateListTitle || updateListTitle.length < 3) {
      setError("List title must be at least 3 characters.")
      return
    }
    try {
      setIsUpdatingList(true)
      const res = await fetch(`https://localhost:5274/api/v1/lists/${selectedListId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId: selectedListId,
          title: updateListTitle,
          order: updateListOrder,
        }),
      })
      if (!res.ok) throw new Error("Failed to update list")
      setShowUpdateListModal(false)
      await fetchLists()
    } catch (err: any) {
      console.error(err)
      setError("Error updating list")
    } finally {
      setIsUpdatingList(false)
    }
  }

  function openDeleteListModal(listId: string) {
    setDeleteListId(listId)
    setShowDeleteListModal(true)
  }

  async function handleDeleteList() {
    if (!deleteListId) return
    try {
      setIsDeletingList(true)
      const res = await fetch(`https://localhost:5274/api/v1/lists/${deleteListId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete list")
      setShowDeleteListModal(false)
      await fetchLists()
    } catch (err: any) {
      console.error(err)
      setError("Error deleting list")
    } finally {
      setIsDeletingList(false)
    }
  }

  // ============= CARD CRUD =============
  function openAddCardModal(listId: string) {
    setAddCardListId(listId)
    setNewCardTitle("")
    setNewCardDesc("")
    setNewCardOrder(0)
    setShowAddCardModal(true)
  }

  async function handleAddCard() {
    if (!newCardTitle || newCardTitle.length < 3) {
      setError("Card title must be at least 3 characters.")
      return
    }
    try {
      setIsAddingCard(true)
      const res = await fetch(`https://localhost:5274/api/v1/lists/${addCardListId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCardTitle,
          description: newCardDesc,
        }),
      })
      if (!res.ok) {
        const errorBody = await res.text()
        console.error("API Error:", errorBody)
        throw new Error("Failed to add card")
      }
      setShowAddCardModal(false)
      await fetchLists()
    } catch (err: any) {
      console.error(err)
      setError("Error adding card")
    } finally {
      setIsAddingCard(false)
    }
  }

  function openUpdateCardModal(card: Card) {
    setUpdateCardId(card.cardId)
    setUpdateCardTitle(card.title)
    setUpdateCardDesc(card.description || "")
    setUpdateCardOrder(card.order)
    setShowUpdateCardModal(true)
  }

  async function handleUpdateCard() {
    if (!updateCardTitle || updateCardTitle.length < 3) {
      setError("Card title must be at least 3 characters.")
      return
    }
    try {
      setIsUpdatingCard(true)
      const res = await fetch(`https://localhost:5274/api/v1/cards/${updateCardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: updateCardId,
          title: updateCardTitle,
          order: updateCardOrder,
          description: updateCardDesc,
        }),
      })
      if (!res.ok) throw new Error("Failed to update card")
      setShowUpdateCardModal(false)
      await fetchLists()
    } catch (err: any) {
      console.error(err)
      setError("Error updating card")
    } finally {
      setIsUpdatingCard(false)
    }
  }

  function openDeleteCardModal(cardId: string) {
    setDeleteCardId(cardId)
    setShowDeleteCardModal(true)
  }

  async function handleDeleteCard() {
    if (!deleteCardId) return
    try {
      setIsDeletingCard(true)
      const res = await fetch(`https://localhost:5274/api/v1/cards/${deleteCardId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete card")
      setShowDeleteCardModal(false)
      await fetchLists()
    } catch (err: any) {
      console.error(err)
      setError("Error deleting card")
    } finally {
      setIsDeletingCard(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="p-6 pt-20 md:pt-24 max-w-[1600px] mx-auto">
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

      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4 -ml-2 text-gray-600 hover:text-violet-700 hover:bg-violet-50"
          onClick={() => router.push("/home")}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Boards
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
              {boardDetail ? boardDetail.title : "Loading Board..."}
            </h1>
            <p className="text-gray-500 mt-1">Manage your tasks and projects</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              onClick={() => setShowAddListModal(true)}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
              size="lg"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add List</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Lists & Cards */}
      {lists.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 border border-gray-100 rounded-xl p-10 text-center"
        >
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutList className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No lists yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Create your first list to start organizing your tasks and projects.
          </p>
          <Button
            onClick={() => setShowAddListModal(true)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Your First List
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          {lists.map((list, index) => (
            <motion.div
              key={list.listId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col h-full"
            >
              <div className="bg-gray-50 rounded-t-lg border border-gray-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                  <h2 className="font-semibold text-gray-800">{list.title}</h2>
                </div>
                {/* <div className="relative">
                    <Button variant="ghost" size="sm" className="h-7 w-7 rounded-full p-0">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </Button>
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:block">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-32">
                      <button
                        className="flex w-full items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => openUpdateListModal(list)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-2" />
                        Edit List
                      </button>
                      <button
                        className="flex w-full items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => openDeleteListModal(list.listId)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete List
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="flex-1 bg-gray-50/50 rounded-b-lg border-x border-b border-gray-200 p-3">
                <div className="mb-3">
                  <CardList
                    listId={list.listId}
                    onOpenUpdateCard={(card) => openUpdateCardModal(card)}
                    onOpenDeleteCard={(cardId) => openDeleteCardModal(cardId)}
                  />
                </div>

                <Button
                  onClick={() => openAddCardModal(list.listId)}
                  variant="outline"
                  className="w-full justify-center text-gray-600 hover:text-violet-700 hover:border-violet-200 hover:bg-violet-50 mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ADD LIST MODAL */}
      <Modal
        isOpen={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        title="Add List"
        icon={<LayoutList className="h-5 w-5 text-violet-600" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAddListModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddList}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              disabled={isAddingList || newListTitle.length < 3}
            >
              {isAddingList ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add List
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="py-2">
          <label htmlFor="listTitle" className="text-sm font-medium text-gray-700 block mb-2">
            List Title
          </label>
          <Input
            id="listTitle"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter list title"
            className="w-full"
            autoFocus
          />
          {newListTitle.length > 0 && newListTitle.length < 3 && (
            <p className="text-sm text-red-500 mt-1">Title must be at least 3 characters long</p>
          )}
        </div>
      </Modal>

      {/* UPDATE LIST MODAL */}
      <Modal
        isOpen={showUpdateListModal}
        onClose={() => setShowUpdateListModal(false)}
        title="Edit List"
        icon={<Pencil className="h-5 w-5 text-violet-600" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowUpdateListModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateList}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              disabled={isUpdatingList || updateListTitle.length < 3}
            >
              {isUpdatingList ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Update List
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="py-2">
          <label htmlFor="updateListTitle" className="text-sm font-medium text-gray-700 block mb-2">
            List Title
          </label>
          <Input
            id="updateListTitle"
            value={updateListTitle}
            onChange={(e) => setUpdateListTitle(e.target.value)}
            placeholder="Enter list title"
            className="w-full"
            autoFocus
          />
          {updateListTitle.length > 0 && updateListTitle.length < 3 && (
            <p className="text-sm text-red-500 mt-1">Title must be at least 3 characters long</p>
          )}

          <label htmlFor="updateListOrder" className="text-sm font-medium text-gray-700 block mt-4 mb-2">
            Order
          </label>
          <Input
            id="updateListOrder"
            type="number"
            value={updateListOrder}
            onChange={(e) => setUpdateListOrder(Number(e.target.value))}
            placeholder="Enter list order"
            className="w-full"
          />
        </div>
      </Modal>

      {/* DELETE LIST MODAL */}
      <Modal
        isOpen={showDeleteListModal}
        onClose={() => setShowDeleteListModal(false)}
        title="Delete List"
        icon={<Trash2 className="h-5 w-5 text-red-500" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDeleteListModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteList}
              disabled={isDeletingList}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingList ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete List
                </>
              )}
            </Button>
          </>
        }
      >
        <CustomAlert variant="destructive" icon={<AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}>
          Are you sure you want to delete this list? All cards in this list will also be deleted. This action cannot be
          undone.
        </CustomAlert>
      </Modal>

      {/* ADD CARD MODAL */}
      <Modal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        title="Add Card"
        icon={<CreditCard className="h-5 w-5 text-violet-600" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAddCardModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCard}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              disabled={isAddingCard || newCardTitle.length < 3}
            >
              {isAddingCard ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Card
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="py-2">
          <label htmlFor="cardTitle" className="text-sm font-medium text-gray-700 block mb-2">
            Card Title
          </label>
          <Input
            id="cardTitle"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter card title"
            className="w-full"
            autoFocus
          />
          {newCardTitle.length > 0 && newCardTitle.length < 3 && (
            <p className="text-sm text-red-500 mt-1">Title must be at least 3 characters long</p>
          )}

          <label htmlFor="cardDescription" className="text-sm font-medium text-gray-700 block mt-4 mb-2">
            Description (optional)
          </label>
          <textarea
            id="cardDescription"
            value={newCardDesc}
            onChange={(e) => setNewCardDesc(e.target.value)}
            placeholder="Enter card description"
            className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 text-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
          />
        </div>
      </Modal>

      {/* UPDATE CARD MODAL */}
      <Modal
        isOpen={showUpdateCardModal}
        onClose={() => setShowUpdateCardModal(false)}
        title="Edit Card"
        icon={<Pencil className="h-5 w-5 text-violet-600" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowUpdateCardModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCard}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              disabled={isUpdatingCard || updateCardTitle.length < 3}
            >
              {isUpdatingCard ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Update Card
                </>
              )}
            </Button>
          </>
        }
      >
        <div className="py-2">
          <label htmlFor="updateCardTitle" className="text-sm font-medium text-gray-700 block mb-2">
            Card Title
          </label>
          <Input
            id="updateCardTitle"
            value={updateCardTitle}
            onChange={(e) => setUpdateCardTitle(e.target.value)}
            placeholder="Enter card title"
            className="w-full"
            autoFocus
          />
          {updateCardTitle.length > 0 && updateCardTitle.length < 3 && (
            <p className="text-sm text-red-500 mt-1">Title must be at least 3 characters long</p>
          )}

          <label htmlFor="updateCardDescription" className="text-sm font-medium text-gray-700 block mt-4 mb-2">
            Description (optional)
          </label>
          <textarea
            id="updateCardDescription"
            value={updateCardDesc}
            onChange={(e) => setUpdateCardDesc(e.target.value)}
            placeholder="Enter card description"
            className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 text-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
          />

          <label htmlFor="updateCardOrder" className="text-sm font-medium text-gray-700 block mt-4 mb-2">
            Order
          </label>
          <Input
            id="updateCardOrder"
            type="number"
            value={updateCardOrder}
            onChange={(e) => setUpdateCardOrder(Number(e.target.value))}
            placeholder="Enter card order"
            className="w-full"
          />
        </div>
      </Modal>

      {/* DELETE CARD MODAL */}
      <Modal
        isOpen={showDeleteCardModal}
        onClose={() => setShowDeleteCardModal(false)}
        title="Delete Card"
        icon={<Trash2 className="h-5 w-5 text-red-500" />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowDeleteCardModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCard}
              disabled={isDeletingCard}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingCard ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Card
                </>
              )}
            </Button>
          </>
        }
      >
        <CustomAlert variant="destructive" icon={<AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}>
          Are you sure you want to delete this card? This action cannot be undone.
        </CustomAlert>
      </Modal>
    </div>
  )
}
