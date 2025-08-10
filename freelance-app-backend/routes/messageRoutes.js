import express from "express";
import {
  createMessage,
  getMessagesByConversationId,
} from "../controllers/messageController.js";


const router = express.Router();

// 🔸 Message routes
router.post("/message", createMessage); // POST /chat/message
router.get("/messages/:conversationId", getMessagesByConversationId); // GET /chat/messages/:conversationId

export default router;
