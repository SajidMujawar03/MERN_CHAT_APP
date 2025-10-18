import io, { type Socket } from "socket.io-client"


import { create } from "zustand"
import type { User } from "./userStore"

type SocketStore = {
    socket: Socket | null,
    connected: boolean,
    initializeSocket: (user: User | null) => void,
    disconnectSocket: () => void
}

const useSocket = create<SocketStore>()((set, get) => (
    {
        socket: null,
        connected: false,

        initializeSocket: (user) => {


            if (user) {
                const socket = io(import.meta.env.VITE_BACKEND_URL)
                socket.emit("setup", user)
                socket.on("connected", () => {


                    set({ connected: true })
                })

                set({ socket })
            }
        },
        disconnectSocket: () => {
            const socket = get().socket;
            if (socket) {
                socket.disconnect();
                set({ socket: null, connected: false })
            }
        }
    }

))



export default useSocket