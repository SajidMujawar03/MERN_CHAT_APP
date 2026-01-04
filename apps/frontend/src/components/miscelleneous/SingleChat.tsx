import React, {
  useState,
  useRef,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
} from "react";
import useUser from "../../store/userStore";
import useChat, { type Chat } from "../../store/chatStore";
import { getSender } from "../../config/helpers";
import { FaEye } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupModal";
import api from "../../config/axiosConfig";
import MessageComponent from "../MessageComponent/MessageComponent";
import useSocket from "../../store/socketStore";
import useNotification from "../../store/notificationStore";
import { toast } from "react-toastify";

type SingleChatProps = {
  fetchAgain: boolean;
  setFetchAgain: Dispatch<SetStateAction<boolean>>;
};

export type Message = {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    pic?: string;
  };
  chat: Chat;
  createdAt: string;
  updatedAt: string;
  optimistic?: boolean;
};

const SingleChat: React.FC<SingleChatProps> = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChat();
  const { user } = useUser();
  const { setNotification } = useNotification()
  const [isProfileModal, setProfileModal] = useState(false);
  const [isUpdateGroup, setUpdateGroup] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, connected } = useSocket();

  const typingTimeoutRef = useRef<number | null>(null);
  const selectedChatRef = useRef<Chat | null>(null);

  // NEW: Global listener for "new message" events (personal user room notifications)
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (newMsg: Message) => {
      const currentChat = selectedChatRef.current;

      if (!currentChat || currentChat._id !== newMsg.chat._id) {
        // Not current chat: Compute preview and trigger notification
      } else {
        // Is current chat: Add to messages
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on("new message", handleNewMessage);

    return () => {
      socket.off("new message", handleNewMessage);
    };
  }, [socket, user, setNotification]);

  useEffect(() => {
    if (selectedChat && connected) {
      socket?.emit("join room", selectedChat._id);
      selectedChatRef.current = selectedChat; // ✅ persist across renders
    }

    return () => {
      socket?.emit("leave room", selectedChat?._id);
    };
  }, [selectedChat, connected]);


  const fetchMessages = async () => {
    if (!selectedChat?._id) return;
    try {
      setLoading(true);
      const res = await api.get(`/message/${selectedChat._id}`);
      setMessages(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const optimisticMsg: Message = {
      _id: `temp-${Date.now()}`,
      content: message.trim(),
      sender: { _id: user!._id, name: user!.name },
      chat: selectedChat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      optimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setMessage("");

    if (typing) {
      socket?.emit("stop typing", { chat: selectedChat._id, user: user?.name });
      setTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }

    try {
      const res = await api.post("/message", {
        content: optimisticMsg.content,
        chat: selectedChat._id,
      });

      const savedMessage = res.data.data;
      setMessages((prev) =>
        prev.map((msg) => (msg._id === optimisticMsg._id ? savedMessage : msg))
      );

      if (connected) socket?.emit("send message", savedMessage);
    } catch (err) {
      toast.error("Failed to send message");
      console.error("Send message error:", err);
      setMessages((prev) => prev.filter((msg) => msg._id !== optimisticMsg._id));
    }
  };

  useEffect(() => {
    const handleReceivedMessage = (messageReceived: Message) => {
      const currentChat = selectedChatRef.current;
      
      // Only add if it's the current chat (globals handle notifications)
      if (currentChat && currentChat._id === messageReceived.chat._id) {
        setMessages((prev) => [...prev, messageReceived]);
      }
    };


    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    socket?.on("received", handleReceivedMessage);
    socket?.on("typing", handleTyping);
    socket?.on("stop typing", handleStopTyping);

    return () => {
      socket?.off("received", handleReceivedMessage);
      socket?.off("typing", handleTyping);
      socket?.off("stop typing", handleStopTyping);
    };
  }, [socket]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (!connected || !selectedChat) return;

    if (!typing) {
      setTyping(true);
      socket?.emit("typing", { chat: selectedChat._id, user: user?.name });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stop typing", { chat: selectedChat._id, user: user?.name });
      setTyping(false);
    }, 1000);
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 rounded-2xl">
        Click on a chat to view messages
      </div>
    );
  }

  const chatName = selectedChat.isGroupChat
    ? selectedChat.chatName
    : getSender(user, selectedChat.users);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 p-4 rounded shadow-md">

      <div className="flex justify-between items-center text-xl font-semibold border-b pb-2 mb-3 text-gray-900 dark:text-gray-100">
        <span>{chatName}</span>
        <FaEye
          className="cursor-pointer hover:text-blue-500 transition"
          onClick={() =>
            selectedChat.isGroupChat ? setUpdateGroup(true) : setProfileModal(true)
          }
        />
      </div>


      <div className="flex-1 overflow-y-auto text-gray-800 dark:text-gray-200 h-full">
        {loading ? (
          <div className="flex justify-center items-center h-full">Loading...</div>
        ) : (
          <>
            <MessageComponent
              messages={messages}
              messageEndRef={messagesEndRef}
              isTyping={isTyping}
            />
            {isTyping && (
              <div className="text-sm italic text-gray-500 mt-1 px-3">typing...</div>
            )}
          </>
        )}
      </div>


      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message"
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition disabled:opacity-60"
          disabled={!connected || loading}
        >
          Send
        </button>
      </form>


      {isProfileModal && (
        <ProfileModal
          user={selectedChat.users.find((u) => u._id !== user?._id) || null}
          closeModal={() => setProfileModal(false)}
        />
      )}
      {isUpdateGroup && (
        <UpdateGroupModal
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          onClose={() => setUpdateGroup(false)}
        />
      )}
    </div>
  );
};

export default SingleChat;