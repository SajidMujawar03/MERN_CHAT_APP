/**
 * @author: Sajid Mujawar
 */

import express from "express";
import cors from "cors";
import { envConfig, socketConfig } from "./config/index.ts";
import chalk from "chalk";
import type { IRoute } from "./interfaces/index.ts";
import { errorMiddleware } from "./middleware/error.middleware.ts";
import http from "http";
import { Server } from "socket.io";
import { EnvUtils } from "./utils/index.ts";
import { authRouter, chatRouter, messageRouter, userRouter } from "./routes/index.ts";
import { DatabaseUtils } from "./utils/index.ts";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use(cors({ origin: "*" }));
app.use(express.json());

EnvUtils.checkEnvVariables();

io.on(socketConfig.on.connection, (socket) => {
  console.warn(chalk.green.bold(`Socket Connected!!`));

  socket.on(socketConfig.on.setup, (user) => {
    socket.join(user._id);
    console.warn("User with user id : '" + user._id + "' got connected!!");
    socket.emit(socketConfig.emit.connected);
  });

  socket.on(socketConfig.on.joinRoom, (roomId) => {
    socket.join(roomId);
    console.warn("User joined in room : " + roomId);
  });

  socket.on(socketConfig.on.leaveRoom, (roomId) => {
    socket.leave(roomId);
    console.warn("User leaved the room : " + roomId);
  });

  socket.on(socketConfig.on.typing, (info) => {
    socket.in(info.chat).emit(socketConfig.emit.typing, info.user);
  });

  socket.on(socketConfig.on.stopTyping, (info) => {
    console.warn("typing", info);
    socket.in(info.chat).emit(socketConfig.emit.stopTyping, info.user);
  });

  socket.on(socketConfig.on.sendMessage, (message) => {
    const chat = message?.chat;
    console.warn(chalk.greenBright.bold("message sent"));
    if (!chat.users) return;

    // Emit to the chat room for real-time updates (exclude sender)
    socket.to(chat._id).emit(socketConfig.emit.received, message);

    chat.users.forEach((user: any) => {
      if (user._id !== message.sender._id) {
        io.to(user._id).emit(socketConfig.emit.newMessage, message);
      }
    });
  });

  socket.on(socketConfig.on.disconnect, () => {
    console.warn("Socket disconnected:", socket.id);
  });
});

initializeRoutes([authRouter, userRouter, chatRouter, messageRouter]);

app.use(errorMiddleware);

// Start server and connect DB inside app.listen
const PORT = envConfig.requiredEnvVariables.PORT;

server.listen(PORT, async () => {
  try {
    await DatabaseUtils.connectDB();
    console.error(
      chalk.green.bold(`Server started on port ${PORT} and DB connected`),
    );
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1); // exit process if DB connection fails
  }
});

function initializeRoutes(routes: IRoute[]) {
  routes.forEach((route: IRoute) => {
    app.use("/", route.router);
  });
}