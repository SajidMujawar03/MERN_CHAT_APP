import express, { Request, Response, type Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import chats from "./data/data";
import connectDB from "./config/database";
import chalk from "chalk";
import authRoute from "./routes/auth.router";
import { Route } from "./interfaces/route.interface";
import { errorMiddleware } from "./middleware/error.middleware";
import userRoute from "./routes/user.route";
import chatRoute from "./routes/chat.route";
import messageRoute from "./routes/message.route";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
})

app.use(cors({ origin: "*" }));
app.use(express.json());

io.on("connection", (socket) => {
  console.log(
    chalk.green.bold(`Socket Connected!!`)
  )

  socket.on("setup", (user) => {
    socket.join(user._id)
    console.log("User with user id : '" + user._id + "' got connected!!")
    socket.emit("connected")
  })

  socket.on("join room", (roomId) => {
    socket.join(roomId)
    console.log("User joined in room : " + roomId)
  })

  socket.on("leave room", (roomId) => {
    socket.leave(roomId)
    console.log("User leaved the room : " + roomId)
  })


  socket.on("typing", (info) => {
    socket.in(info.chat).emit("typing", info.user)

  })

  socket.on("stop typing", (info) => {
    console.log("typing", info)
    socket.in(info.chat).emit("stop typing", info.user)
  })


  socket.on("send message", (message) => {
    const chat = message?.chat;
    console.log(chalk.greenBright.bold("message sent"));
    if (!chat.users) return;

    // Emit to the chat room for real-time updates (exclude sender)
    socket.to(chat._id).emit("received", message);


    chat.users.forEach((user: any) => {
      if (user._id !== message.sender._id) {

        io.to(user._id).emit("new message", message);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
})

initializeRoutes([authRoute, userRoute, chatRoute, messageRoute]);

app.use(errorMiddleware);





// Start server and connect DB inside app.listen
const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(
      chalk.green.bold(`Server started on port ${PORT} and DB connected`)
    );
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1); // exit process if DB connection fails
  }
});

function initializeRoutes(routes: Route[]) {
  routes.forEach((route: Route) => {
    app.use("/", route.router);
  });
}
