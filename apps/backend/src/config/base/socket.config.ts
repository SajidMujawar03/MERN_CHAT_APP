const socketConfig = {
    on :{
        connection : "connection",
        setup : "setup",
        joinRoom : "join room",
        leaveRoom : "leave room",
        typing : "typing",
        stopTyping : "stop typing",
        sendMessage : "send message",
        disconnect : "disconnect"
    },
    emit : {
        connected : "connected",
        received : "received",
        newMessage : "new message",
        typing : "typing",
        stopTyping : "stop typing",
    }
} as const;

export default socketConfig;