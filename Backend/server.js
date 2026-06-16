import dns from "dns";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import userRouter from "./Routes/userRoutes.js";
import messageRouter from "./Routes/messageRouter.js";
dns.setDefaultResultOrder("ipv4first");
dotenv.config();
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: "*" }
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use(express.json());
app.use(cors());

app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT);
  } catch (error) {
    console.error("Critical server failure:", error.message);
    process.exit(1);
  }
};
startServer();

export default server;