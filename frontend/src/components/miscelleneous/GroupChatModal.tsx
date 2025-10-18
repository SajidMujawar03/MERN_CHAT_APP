import { useQuery } from "@tanstack/react-query";
import api from "../../config/axiosConfig";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import type { User } from "../../store/userStore";
import { toast } from "react-toastify";
import useChat from "../../store/chatStore";

type GroupChatModalProps = {
    onClose: () => void;
};

const GroupChatModal: React.FC<GroupChatModalProps> = ({ onClose }) => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [groupName, setGroupName] = useState("");
    const {setChats}=useChat()

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 500);
        return () => clearTimeout(timeout);
    }, [query]);

    // Fetch users based on debounced query
    const { data: users = [], isError, isLoading, error } = useQuery<User[], Error>({
        queryKey: ["users", debouncedQuery],
        queryFn: async () => {
            const res = await api.get(`/user?search=${debouncedQuery}`);
            return res.data.data;
        },
        enabled: debouncedQuery.length > 0,
    });

    // Toggle user selection
    const toggleUser = (user: User) => {
        setSelectedUsers((prev) =>
            prev.find((u) => u._id === user._id)
                ? prev.filter((u) => u._id !== user._id)
                : [...prev, user]
        );
    };

    // Create group chat
    const handleCreate = async () => {
        if (!groupName.trim() || selectedUsers.length === 0) {
            toast.warning("Please enter group name and select at least one user");
            return;
        }

        try {
            const res = await api.post("/chat/create-group-chat", {
                name: groupName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            });
            console.log(res)

            await setChats()

            toast.success(res.data.message);
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to create group chat");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Create Group Chat
                </h2>

                {/* Group Name */}
                <input
                    type="text"
                    placeholder="Enter group chat name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search users to add..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Results */}
                <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
                    {isLoading ? (
                        <p className="text-gray-500 dark:text-gray-400">Searching...</p>
                    ) : isError ? (
                        <p className="text-red-500">Error: {error.message}</p>
                    ) : users.length === 0 && debouncedQuery ? (
                        <p className="text-gray-500 dark:text-gray-400">No users found.</p>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => toggleUser(user)}
                                className={`p-2 rounded cursor-pointer border transition 
                                    ${
                                        selectedUsers.some((u) => u._id === user._id)
                                            ? "bg-blue-600 border-blue-600"
                                            : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                            >
                                <UserCard
                                    user={user}
                                    className={`${
                                        selectedUsers.some((u) => u._id === user._id)
                                            ? "text-white"
                                            : "text-gray-900 dark:text-gray-100"
                                    }`}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Selected users */}
                {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedUsers.map((user) => (
                            <span
                                key={user._id}
                                className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                                {user.name}
                                <button
                                    onClick={() => toggleUser(user)}
                                    className="text-white hover:text-gray-200"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={!groupName.trim() || selectedUsers.length === 0 || isLoading || isError}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupChatModal;
