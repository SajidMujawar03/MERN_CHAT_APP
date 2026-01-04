import { useEffect, useState } from "react";
import useChat, { type Chat } from "../store/chatStore";
import useUser from "../store/userStore";
import GroupChatModal from "./miscelleneous/GroupChatModal"; // Fixed spelling
import clsx from "clsx";
import { getSender } from "../config/helpers";

type UserChatsProps ={
  fetchAgain:boolean
}

const UserChats: React.FC<UserChatsProps> = ({fetchAgain}:UserChatsProps) => {
  const { selectedChat, chats, setChats, setSelectedChat } = useChat(); // Assuming setSelectedChat exists
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added for error handling
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);



  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      await setChats();
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load chats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat:Chat) => {

    setSelectedChat(chat); // Dispatch to store
  };

  const openGroupChatModal = () => setIsGroupModalOpen(true);
  const closeGroupChatModal = () => setIsGroupModalOpen(false);

  return (
    <div className="w-full p-4 bg-secondary dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          My Chats
        </p>
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onClick={openGroupChatModal}
          aria-label="Create new group chat"
        >
          + New Group Chat
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
          {error}
          <button
            onClick={fetchChats}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Chats List */}
      <ul role="list" className="space-y-2">
        {loading ? (
          <li className="text-gray-500 dark:text-gray-400">Loading chats...</li>
        ) : chats.length === 0 ? (
          <li className="text-gray-500 dark:text-gray-400">No chats available.</li>
        ) : (
          chats.map((chat: Chat) => (
            <li
              key={chat._id}
              role="listitem"
              className={clsx(
                "p-3 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition",
                chat._id === selectedChat?._id
                  ? "bg-amber-900 dark:bg-amber-800 ring-2 ring-amber-500 dark:ring-amber-400"
                  : ""
              )}
              onClick={() => handleChatSelect(chat)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleChatSelect(chat)} // Keyboard support
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {chat.isGroupChat ? chat.chatName : getSender(user, chat.users)}
              </p>
            </li>
          ))
        )}
      </ul>

      {/* Group Chat Modal */}
      {isGroupModalOpen && (
        <GroupChatModal onClose={closeGroupChatModal} />
      )}
    </div>
  );
};

export default UserChats;