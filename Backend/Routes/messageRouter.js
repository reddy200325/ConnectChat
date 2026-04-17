import express from "express";
// IMPORTANT: Ensure this path matches your folder structure exactly
import {
  getMessages,
  getUsersForSideBar,
  markMessageAsSeen,
  sendMessages,
  deleteMessage,
  deleteConversation
} from "../controller/messageController.js"; 
import { protectRoute } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSideBar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessages);
messageRouter.delete("/message/:id", protectRoute, deleteMessage);
messageRouter.delete("/conversation/:id", protectRoute, deleteConversation);

export default messageRouter;