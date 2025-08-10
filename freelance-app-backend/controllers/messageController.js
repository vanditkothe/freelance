import Message from "../models/Message.js";

// Create a new message in a conversation
export const createMessage = async (req, res) => {
  try {
    const { conversationId, senderId, message } = req.body;

    if (!conversationId || !senderId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = await Message.create({
      conversationId,
      senderId,
      message,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error in createMessage:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get all messages from a specific conversation
export const getMessagesByConversationId = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Error in getMessagesByConversationId:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
