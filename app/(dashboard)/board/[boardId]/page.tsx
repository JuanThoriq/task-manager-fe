"use client";

import { Spinner } from "@/components/loading";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CardList } from "./components/card-list";

interface BoardDetail {
  boardId: string;
  orgId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// Tipe data List dan Card
interface Card {
  cardId: string;
  title: string;
  order: number;
  description?: string;
  listId: string;
  createdAt: string;
  updatedAt: string;
}

interface ListData {
  listId: string;
  title: string;
  order: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  cards: Card[]; // agar kita bisa menampilkan card di dalam list
}

export default function BoardPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;

  const [boardDetail, setBoardDetail] = useState<BoardDetail | null>(null);
  const [lists, setLists] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State untuk modal Add List
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListOrder, setNewListOrder] = useState<number>(0);

  // State untuk modal Update List
  const [showUpdateListModal, setShowUpdateListModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState("");
  const [updateListTitle, setUpdateListTitle] = useState("");
  const [updateListOrder, setUpdateListOrder] = useState<number>(0);

  // State untuk modal Delete List
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [deleteListId, setDeleteListId] = useState("");

  // State untuk modal Add Card
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [newCardOrder, setNewCardOrder] = useState<number>(0);
  const [addCardListId, setAddCardListId] = useState("");

  // State untuk modal Update Card
  const [showUpdateCardModal, setShowUpdateCardModal] = useState(false);
  const [updateCardId, setUpdateCardId] = useState("");
  const [updateCardTitle, setUpdateCardTitle] = useState("");
  const [updateCardDesc, setUpdateCardDesc] = useState("");
  const [updateCardOrder, setUpdateCardOrder] = useState<number>(0);

  // State untuk modal Delete Card
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState("");

  // Fetch Lists & Cards
  useEffect(() => {
    if (!boardId) return;
    fetchBoardDetail();
    fetchLists();
  }, [boardId]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Bersihkan error
        router.push(`/board/${boardId}`); // Ganti route sesuai kebutuhan
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  async function fetchBoardDetail() {
    try {
      const res = await fetch(`http://localhost:5273/api/v1/boards/${boardId}`);
      if (!res.ok) throw new Error("Failed to fetch board details");
      const data = await res.json();
      setBoardDetail(data);
    } catch (err: any) {
      console.error(err);
      setError("Error fetching board details");
    }
  }

  async function fetchLists() {
    try {
      setLoading(true);
      setError("");
      // Endpoint: GET /api/v1/boards/{boardId}/lists
      const res = await fetch(
        `http://localhost:5273/api/v1/boards/${boardId}/lists`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch lists");
      }
      const data = await res.json();
      // data = array of list, tapi kita juga ingin fetch card per list
      // Atau BE sudah menambahkan array of cards di response? Tergantung implementasi
      // Asumsi: /api/v1/boards/{boardId}/lists TIDAK langsung mengembalikan cards
      // => kita fetch cards satu-satu, atau BE kita modif
      // Sementara, misal kita modif BE agar GET lists juga menyertakan cards
      // Untuk kesederhanaan di sini, kita asumsikan data sudah berisi field "cards"
      setLists(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError("Error fetching lists and cards");
      setLoading(false);
    }
  }

  // ============= LIST CRUD =============
  async function handleAddList() {
    if (!newListTitle || newListTitle.length < 3) {
      setError("List title must be at least 3 characters.");
      return;
    }
    try {
      // Endpoint: POST /api/v1/boards/{boardId}/lists
      const res = await fetch(
        `http://localhost:5273/api/v1/boards/${boardId}/lists`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            boardId: boardId,
            title: newListTitle,
            order: newListOrder,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to add list");
      setShowAddListModal(false);
      setNewListTitle("");
      setNewListOrder(0);
      await fetchLists();
    } catch (err: any) {
      console.error(err);
      setError("Error adding list");
    }
  }

  function openUpdateListModal(list: ListData) {
    setSelectedListId(list.listId);
    setUpdateListTitle(list.title);
    setUpdateListOrder(list.order);
    setShowUpdateListModal(true);
  }

  async function handleUpdateList() {
    if (!updateListTitle || updateListTitle.length < 3) {
      setError("List title must be at least 3 characters.");
      return;
    }
    try {
      // Endpoint: PUT /api/v1/lists/{listId}
      const res = await fetch(
        `http://localhost:5273/api/v1/lists/${selectedListId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listId: selectedListId,
            title: updateListTitle,
            order: updateListOrder,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update list");
      setShowUpdateListModal(false);
      await fetchLists();
    } catch (err: any) {
      console.error(err);
      setError("Error updating list");
    }
  }

  function openDeleteListModal(listId: string) {
    setDeleteListId(listId);
    setShowDeleteListModal(true);
  }

  async function handleDeleteList() {
    if (!deleteListId) return;
    try {
      // Endpoint: DELETE /api/v1/lists/{listId}
      const res = await fetch(
        `http://localhost:5273/api/v1/lists/${deleteListId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete list");
      setShowDeleteListModal(false);
      await fetchLists();
    } catch (err: any) {
      console.error(err);
      setError("Error deleting list");
    }
  }

  // ============= CARD CRUD =============
  function openAddCardModal(listId: string) {
    setAddCardListId(listId);
    setNewCardTitle("");
    setNewCardDesc("");
    setNewCardOrder(0);
    setShowAddCardModal(true);
  }

  async function handleAddCard() {
    if (!newCardTitle || newCardTitle.length < 3) {
      setError("Card title must be at least 3 characters.");
      return;
    }
    try {
      // Endpoint: POST /api/v1/lists/{listId}/cards
      const res = await fetch(
        `http://localhost:5273/api/v1/lists/${addCardListId}/cards`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listId: selectedListId,
            title: newCardTitle,
            order: newCardOrder,
            description: newCardDesc,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to add card");
      setShowAddCardModal(false);
      await fetchLists();
    } catch (err: any) {
      console.error(err);
      setError("Error adding card");
    }
  }

  function openUpdateCardModal(card: Card) {
    setUpdateCardId(card.cardId);
    setUpdateCardTitle(card.title);
    setUpdateCardDesc(card.description || "");
    setUpdateCardOrder(card.order);
    setShowUpdateCardModal(true);
  }

  async function handleUpdateCard() {
    if (!updateCardTitle || updateCardTitle.length < 3) {
      setError("Card title must be at least 3 characters.");
      return;
    }
    try {
      // Endpoint: PUT /api/v1/cards/{cardId}
      const res = await fetch(
        `http://localhost:5273/api/v1/cards/${updateCardId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId: updateCardId,
            title: updateCardTitle,
            order: updateCardOrder,
            description: updateCardDesc,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update card");
      setShowUpdateCardModal(false);
      await fetchLists();
    } catch (err: any) {
      console.error(err);
      setError("Error updating card");
    }
  }

  function openDeleteCardModal(cardId: string) {
    setDeleteCardId(cardId);
    setShowDeleteCardModal(true);
  }

  async function handleDeleteCard() {
    if (!deleteCardId) return;
    try {
      // Endpoint: DELETE /api/v1/cards/{cardId}
      const res = await fetch(
        `http://localhost:5273/api/v1/cards/${deleteCardId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete card");
      setShowDeleteCardModal(false);
      await fetchLists();
    } catch (err: any) {
      console.error(err);
      setError("Error deleting card");
    }
  }

  // Return UI
  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {boardDetail ? boardDetail.title : "Loading Board..."}
      </h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddListModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add List
        </button>
      </div>

      {/* Daftar List & Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lists.map((list) => {
          console.log("list object:", list);
          return (
            <div key={list.listId} className="border rounded p-4 relative">
              <h2 className="font-bold mb-2">{list.title}</h2>
              {/* Tombol Update/Delete List */}
              <div className="absolute top-2 right-2 flex space-x-2 text-xs">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => openUpdateListModal(list)}
                >
                  Update
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => openDeleteListModal(list.listId)}
                >
                  Delete
                </button>
              </div>
              {/* Menampilkan Cards */}
              <div className="mt-4">
                <CardList
                  listId={list.listId}
                  onOpenUpdateCard={(card) => openUpdateCardModal(card)}
                  onOpenDeleteCard={(cardId) => openDeleteCardModal(cardId)}
                />
              </div>
              {/* Tombol Add Card */}
              <button
                onClick={() => openAddCardModal(list.listId)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                Add Card
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL Add List */}
      {showAddListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-md min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Add List</h2>
            <input
              type="text"
              placeholder="List Title"
              className="border p-2 w-full mb-2"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddListModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddList}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL Update List */}
      {showUpdateListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-md min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Edit List</h2>
            <input
              type="text"
              placeholder="List Title"
              className="border p-2 w-full mb-2"
              value={updateListTitle}
              onChange={(e) => setUpdateListTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Order"
              className="border p-2 w-full mb-4"
              value={updateListOrder}
              onChange={(e) => setUpdateListOrder(Number(e.target.value))}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUpdateListModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateList}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Edit List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL Delete List */}
      {showDeleteListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-md min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Delete List</h2>
            <p className="mb-4">Are you sure you want to delete this list?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteListModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteList}
                className="px-4 py-2 bg-red-600 hover:bg-red-800 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL Add Card */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-md min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Add Card</h2>
            <input
              type="text"
              placeholder="Card Title"
              className="border p-2 w-full mb-2"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={newCardDesc}
              onChange={(e) => setNewCardDesc(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL Update Card */}
      {showUpdateCardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-md min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Edit Card</h2>
            <input
              type="text"
              placeholder="Card Title"
              className="border p-2 w-full mb-2"
              value={updateCardTitle}
              onChange={(e) => setUpdateCardTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={updateCardDesc}
              onChange={(e) => setUpdateCardDesc(e.target.value)}
            />
            <input
              type="number"
              placeholder="Order"
              className="border p-2 w-full mb-4"
              value={updateCardOrder}
              onChange={(e) => setUpdateCardOrder(Number(e.target.value))}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUpdateCardModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCard}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Edit Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL Delete Card */}
      {showDeleteCardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded shadow-md min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Delete Card</h2>
            <p className="mb-4">Are you sure you want to delete this card?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteCardModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCard}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
