import React, { useEffect, useState } from "react";

interface Card {
  cardId: string;
  title: string;
  order: number;
  description?: string;
  listId: string;
  createdAt: string;
  updatedAt: string;
}

interface CardListProps {
  listId: string;
  // Opsional: Callback untuk membuka modal update atau delete dari komponen induk
  onOpenUpdateCard?: (card: Card) => void;
  onOpenDeleteCard?: (cardId: string) => void;
}

export function CardList({
  listId,
  onOpenUpdateCard,
  onOpenDeleteCard,
}: CardListProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCards();
  }, [listId]);

  async function fetchCards() {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5273/api/v1/lists/${listId}/cards`
      );
      if (!res.ok) throw new Error("Failed to fetch cards");
      const data = await res.json();
      setCards(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError("Error fetching cards");
      setLoading(false);
    }
  }

  // Jika tidak menggunakan callback dari parent, Anda bisa menghandle modal update/delete di sini.
  // Contoh fungsi untuk membuka modal update/delete (bisa disesuaikan dengan state modal masing-masing)
  const handleOpenUpdate = (card: Card) => {
    if (onOpenUpdateCard) {
      onOpenUpdateCard(card);
    } else {
      // Jika modal dikelola lokal di CardList, simpan state dan tampilkan modal update.
      console.log("Open update modal for card:", card);
    }
  };

  const handleOpenDelete = (cardId: string) => {
    if (onOpenDeleteCard) {
      onOpenDeleteCard(cardId);
    } else {
      // Jika modal dikelola lokal di CardList, simpan state dan tampilkan modal delete.
      console.log("Open delete modal for card:", cardId);
    }
  };

  if (loading)
    return <div className="text-sm text-gray-500">Loading cards...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="space-y-2">
      {cards.map((card) => (
        <div
          key={card.cardId}
          className="border rounded p-2 relative wrap-break-word"
        >
          <p className="font-semibold">{card.title}</p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {card.description || "No description"}
          </p>
          <div className="absolute top-2 right-2 flex space-x-2 text-xs">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => handleOpenUpdate(card)}
            >
              Update
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleOpenDelete(card.cardId)}
            >
              Delete
            </button>
          </div>
          {/* Anda bisa menambahkan tombol update/delete untuk card di sini */}
        </div>
      ))}
    </div>
  );
}
