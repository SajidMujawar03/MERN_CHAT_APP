import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import useChat, { type Chat } from "../store/chatStore";
import useNotification from "../store/notificationStore"; // if you have one
import SingleChat, { type Message } from "./miscelleneous/SingleChat";
import useSocket from "../store/socketStore";
import useUser from "../store/userStore";
import { getSender } from "../config/helpers";

type ChatComponentProps = {
  fetchAgain: boolean;
  setFetchAgain: Dispatch<SetStateAction<boolean>>;
};

const ChatComponent: React.FC<ChatComponentProps> = ({ fetchAgain, setFetchAgain }:ChatComponentProps) => {
  const { selectedChat } = useChat();
  const { setNotification } = useNotification(); // example: function to store new notifications
  const { socket } = useSocket()
  const {user}=useUser();

  const selectedChatRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (newMsg: Message) => {
      const currentChat = selectedChatRef.current;

      if (!currentChat || currentChat._id !== newMsg.chat._id) {
        // Not current chat: Compute preview and trigger notification
        const chatPreview = newMsg.chat.isGroupChat
          ? newMsg.chat.chatName
          : getSender(user, newMsg.chat.users);

        const notificationPayload = {
          ...newMsg,
          chatName: chatPreview,
          chatId: newMsg.chat._id,
        };
        setNotification(notificationPayload);
      } 
    };

    socket.on("new message", handleNewMessage);

    return () => {
      socket.off("new message", handleNewMessage);
    };
  }, [socket, user, setNotification]);

  return (
    <>
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <div className="flex justify-center items-center h-full">
          <h1 className="text-white text-2xl">Select a chat to start messaging</h1>
        </div>
      )}
    </>
  );
};

export default ChatComponent;
