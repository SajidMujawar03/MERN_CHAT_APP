import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../config/axiosConfig";
import UserCard from "./miscelleneous/UserCard";
import useChat from "../store/chatStore";

type SideDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SideDrawer = ({ isOpen, onClose }: SideDrawerProps) => {
  const [query, setQuery] = useState("");

  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { setSelectedChat } = useChat()

  // debounce logic
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["users", debouncedQuery],
    queryFn: async () => {
      const res = await api.get(`/user?search=${debouncedQuery}`);
      return res.data.data;
    },
    enabled: debouncedQuery.length > 0, // only run when user types something
  });

  const accessChat = async (userId: string) => {
    try{
    const res = await api.post(`/chat`, { userId });
    const chat = res.data.data;
    setSelectedChat(chat)

    onClose()
  } catch (err) {
    console.error("Failed to select/create chat:", err);
  }
}

return (
  <>
    {/* Overlay */}
    <div
      className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      onClick={onClose}
    ></div>

    {/* Drawer */}
    <div
      className={`fixed top-0 left-0 w-72 h-full bg-primary shadow-lg z-50 transform transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Header */}
      <div className="flex justify-between h-20 items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Search Users
        </h2>
        <button
          className="text-gray-600 dark:text-gray-300 font-bold text-xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      {/* Search and Results */}
      <div className="p-4 space-y-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search user..."
          className="w-full p-2 border rounded-md text-text"
        />

        {/* States */}
        {isLoading && <p>Loading...</p>}
        {isError && (
          <p className="text-red-500">
            Error: {(error as Error).message}
          </p>
        )}

        {/* Results */}
        {data && data.length > 0 && (
          <ul className="mt-3 space-y-2">
            {data.map((user: any) => (
              <UserCard user={user} onClick={accessChat} />
            ))}
          </ul>
        )}

        {/* Empty state */}
        {data && data.length === 0 && debouncedQuery && (
          <p className="text-gray-500 text-sm">No users found.</p>
        )}

        {/* No query entered yet */}
        {!debouncedQuery && (
          <p className="text-gray-400 text-sm">Start typing to search...</p>
        )}
      </div>
    </div>
  </>
);
};

export default SideDrawer;
