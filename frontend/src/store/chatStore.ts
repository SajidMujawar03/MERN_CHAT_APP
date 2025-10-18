import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../config/axiosConfig";
import type { User } from "./userStore";



export type Chat = {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: User[];
    groupAdmin: User
};

type ChatStore = {
    chats: Chat[];
    selectedChat: Chat | null;
    setSelectedChat: (chat: Chat | null) => void;
    setChats: () => Promise<void>;
};

const useChat = create<ChatStore>()(
    devtools(
        (set, get) => ({
            chats: [],
            selectedChat: null,
            setSelectedChat: (chat: Chat | null) => {

                if (chat === null) {
                    set({
                        selectedChat: null
                    })
                }
                else {
                    const chats = get().chats;
                 
                    set({
                        selectedChat: chat,
                        chats: chats.find((c) => c._id === chat._id) ? chats : [...chats, chat],
                    });
                }


            },

            setChats: async () => {
                try {
                    const res = await api.get("/chat");

                    set({ chats: res.data.data });




                } catch (err) {
                    console.error("Failed to fetch chats:", err);
                }
            },
        }),
        { name: "chats" }
    )
);

export default useChat;
