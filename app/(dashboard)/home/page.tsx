"use client";
import { Spinner } from "@/components/loading";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Tipe data Board
interface Board {
  boardId: string;
  orgId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State untuk pop-up Add Board
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  // State untuk pop-up Update Board
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateBoardTitle, setUpdateBoardTitle] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");

  // State untuk pop-up Delete Board
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBoardId, setDeleteBoardId] = useState("");

  useEffect(() => {
    fetchBoards();
  }, []);

  // Fungsi untuk melakukan redirect otomatis setelah error selama 5 detik
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
        // Redirect kembali ke homePage
        router.push("/home");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  // Fetch boards via GET
  const fetchBoards = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5273/api/v1/boards?orgId=1`);
      if (!res.ok) {
        throw new Error("Failed to fetch boards");
      }
      const data = await res.json();
      setBoards(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError("Error fetching boards");
      setLoading(false);
    }
  };

  // Handle Create Board
  const handleAddBoard = async () => {
    if (!newBoardTitle || newBoardTitle.length < 3) {
      setError("Board title must be at least 3 characters long.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5273/api/v1/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: "1", title: newBoardTitle }),
      });
      if (!res.ok) {
        throw new Error("Failed to create board");
      }
      // Refresh boards
      await fetchBoards();
      // Reset state
      setNewBoardTitle("");
      setShowAddModal(false);
    } catch (err: any) {
      console.error(err);
      setError("Error creating board");
    }
  };

  // Open Update Modal
  const openUpdateModal = (boardId: string, currentTitle: string) => {
    setSelectedBoardId(boardId);
    setUpdateBoardTitle(currentTitle);
    setShowUpdateModal(true);
  };

  // Handle Update Board
  const handleUpdateBoard = async () => {
    if (!updateBoardTitle || updateBoardTitle.length < 3 || !selectedBoardId) {
      setError("Board title must be at least 3 characters long.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5273/api/v1/boards/${selectedBoardId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            boardId: selectedBoardId,
            title: updateBoardTitle,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update board");
      }
      await fetchBoards();
      setShowUpdateModal(false);
    } catch (err: any) {
      console.error(err);
      setError("Error updating board");
    }
  };

  // Open Delete Modal
  const openDeleteModal = (boardId: string) => {
    setDeleteBoardId(boardId);
    setShowDeleteModal(true);
  };

  // Handle Delete Board
  const handleDeleteBoard = async () => {
    if (!deleteBoardId) return;

    try {
      const res = await fetch(
        `http://localhost:5273/api/v1/boards/${deleteBoardId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete board");
      }
      await fetchBoards();
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error(err);
      setError("Error deleting board");
    }
  };

  // Navigasi ke BoardPage saat board diclick
  const handleBoardClick = (boardId: string) => {
    router.push(`/board/${boardId}`);
  };

  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Board List</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Board
        </button>
      </div>

      {boards.length === 0 ? (
        <p className="text-gray-500">No boards available. Create one now!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div
              key={board.boardId}
              className="border border-gray-300 shadow-sm bg-white rounded py-4 px-8 flex flex-col-reverse justify-center items-center relative cursor-pointer"
              onClick={() => handleBoardClick(board.boardId)}
            >
              <h2 className="text-lg font-semibold my-8">{board.title}</h2>
              {/* Tombol untuk Update/Delete (dipisahkan dari area click navigasi) */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  className="text-gray-500 hover:text-gray-700 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    openUpdateModal(board.boardId, board.title);
                  }}
                >
                  Update
                </button>
                <button
                  className="text-red-500 hover:text-red-700 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(board.boardId);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD BOARD MODAL */}
      {showAddModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-md min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Add Board</h2>
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Board Title"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE BOARD MODAL */}
      {showUpdateModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-md min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Edit Board</h2>
            <input
              type="text"
              value={updateBoardTitle}
              onChange={(e) => setUpdateBoardTitle(e.target.value)}
              placeholder="Title"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Edit Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE BOARD MODAL */}
      {showDeleteModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-md min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Delete Board</h2>
            <p className="mb-4">Are you sure you want to delete this board?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBoard}
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
