"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pencil, Trash2, MoreHorizontal, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface Card {
  cardId: string
  title: string
  order: number
  description?: string
  listId: string
  createdAt: string
  updatedAt: string
}

interface CardListProps {
  listId: string
  onOpenUpdateCard?: (card: Card) => void
  onOpenDeleteCard?: (cardId: string) => void
}

export function CardList({ listId, onOpenUpdateCard, onOpenDeleteCard }: CardListProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchCards()
  }, [listId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setActiveCardId(null); // closes the dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchCards() {
    try {
      setLoading(true)
      const res = await fetch(`https://localhost:5274/api/v1/lists/${listId}/cards`)
      if (!res.ok) throw new Error("Failed to fetch cards")
      const data = await res.json()
      setCards(data)
      setLoading(false)
    } catch (err: any) {
      console.error(err)
      setError("Error fetching cards")
      setLoading(false)
    }
  }

  const handleOpenUpdate = (card: Card) => {
    if (onOpenUpdateCard) {
      onOpenUpdateCard(card)
    }
  }

  const handleOpenDelete = (cardId: string) => {
    if (onOpenDeleteCard) {
      onOpenDeleteCard(cardId)
    }
  }

  const toggleCardMenu = (cardId: string) => {
    setActiveCardId(activeCardId === cardId ? null : cardId)
  }

  if (loading)
    return (
      <div className="py-6 text-center">
        <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-violet-400 border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Loading cards...</p>
      </div>
    )

  if (error)
    return (
      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    )

  if (cards.length === 0) {
    return (
      <div className="py-6 text-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-500">No cards yet</p>
        <p className="text-xs text-gray-400 mt-1">Click "Add Card" to create one</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.cardId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            className="group relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="mb-2">
              <h3 className="font-medium text-gray-800">{card.title}</h3>
              {card.description && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2 whitespace-pre-wrap">{card.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(card.updatedAt), "MMM d")}</span>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleCardMenu(card.cardId)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>

                <AnimatePresence>
                  {activeCardId === card.cardId && (
                    <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 top-8 z-10 min-w-[120px] rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
                    >
                      <button
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                        onClick={() => {
                          handleOpenUpdate(card)
                          setActiveCardId(null)
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
                        onClick={() => {
                          handleOpenDelete(card.cardId)
                          setActiveCardId(null)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
