import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axiosConfig";
import useChat from "../../store/chatStore";
import useUser from "../../store/userStore";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../../store/userStore";
import UserCard from "./UserCard";

type UpdateGroupModalProps = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

const UpdateGroupModal: React.FC<UpdateGroupModalProps> = ({
  fetchAgain,
  setFetchAgain,
  onClose,
}) => {
  const { selectedChat, setSelectedChat } = useChat();
  const { user } = useUser();

  const [groupName, setGroupName] = useState(selectedChat?.chatName || "");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fix: useEffect instead of useState for debouncing
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 500);
    return () => clearTimeout(timeout);
  }, [query]);

  // ✅ Fetch users based on search query
  const { data: users = [], isFetching } = useQuery<User[]>({
    queryKey: ["users", debouncedQuery],
    queryFn: async () => {
      const res = await api.get(`/user?search=${debouncedQuery}`);
      return res.data.data;
    },
    enabled: debouncedQuery.length > 0,
  });

  // ✅ Rename group
  const handleRename = async () => {
    if (!groupName.trim()) return toast.warning("Group name cannot be empty");

    try {
      setLoading(true);
      const res = await api.put(`/chat/rename-group`, {
        chatId: selectedChat?._id,
        chatName: groupName,
      });
      setSelectedChat(res.data.data);
      setFetchAgain(!fetchAgain);
      toast.success("Group name updated!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to rename group");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add user to group
  const handleAddUser = async (addUser: User) => {
    if (selectedChat?.users.find((u) => u._id === addUser._id)) {
      toast.info("User already in the group");
      return;
    }

    // Only group admin can add users
    if (selectedChat?.groupAdmin._id !== user?._id) {
      toast.error("Only admins can add users");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put(`/chat/add-to-group`, {
        chatId: selectedChat?._id,
        userId: addUser._id,
      });
      setSelectedChat(res.data.data);
      setFetchAgain(!fetchAgain);
      toast.success(`${addUser.name} added to group`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove user from group
  const handleRemoveUser = async (removeUser: User) => {
    // Only group admin or self can remove
    if (
      selectedChat?.groupAdmin._id !== user?._id &&
      removeUser._id !== user?._id
    ) {
      toast.error("Only admins can remove others");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put(`/chat/remove-from-group`, {
        chatId: selectedChat?._id,
        userId: removeUser._id,
      });

      // If current user removed, deselect chat
      if (removeUser._id === user?._id) {
        setSelectedChat(null);
      } else {
        setSelectedChat(res.data.data);
      }
    
      setFetchAgain(!fetchAgain);
      toast.success(
        removeUser._id === user?._id
          ? "You left the group"
          : `${removeUser.name} removed from group`
      );
    } catch (err: any) {
 
      toast.error(err?.response?.data?.message || "Failed to remove user");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Leave group wrapper
  const handleLeaveGroup = async () => {
    await handleRemoveUser(user!);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Update Group Chat
        </h2>

        {/* Rename */}
        <div className="flex mb-3 gap-2">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter new group name"
            className="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
          <button
            onClick={handleRename}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            Update
          </button>
        </div>

        {/* Group members */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Members
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedChat?.users.map((member) => (
              <span
                key={member._id}
                className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {member.name}
                
                {(selectedChat.groupAdmin._id === user?._id ||
                  member._id === user?._id) && (
                  <button
                    onClick={() => handleRemoveUser(member)}
                    disabled={loading || member._id===user._id}
                    className="text-white hover:text-gray-200"
                  >
                   {  member._id!==user._id ? "✕" : ""}
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Add user section */}
        <input
          type="text"
          placeholder="Search users to add..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full mb-3 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
        />

        <div className="max-h-40 overflow-y-auto mb-4 space-y-2">
          {isFetching ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Searching...
            </p>
          ) : (
            users.map((u) => (
              <div
                key={u._id}
                onClick={() => handleAddUser(u)}
                className="p-2 rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <UserCard user={u} />
              </div>
            ))
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleLeaveGroup}
            disabled={loading}
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            Leave Group
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-400 dark:bg-gray-700 text-white hover:bg-gray-500 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupModal;
