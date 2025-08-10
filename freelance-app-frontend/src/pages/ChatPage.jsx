import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { apiConnector } from "../services/apiConnector";
import { CHAT_API } from "../services/apis";
import toast from "react-hot-toast";

let socket; // declare globally, initialize later

const ChatPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !import.meta.env.VITE_SERVER_BASE_URL) return;

    const baseURL = import.meta.env.VITE_SERVER_BASE_URL.replace("/api", "");
    socket = io(baseURL, {
      withCredentials: true,
    });

    socket.emit("join", user.id);

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchMessages();

    return () => {
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [user]);

  const fetchMessages = async () => {
    try {
      const res = await apiConnector("GET", CHAT_API.GET_MESSAGES);
      setMessages(res);
    } catch (err) {
      toast.error("Failed to fetch messages");
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      sender: user.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", msg);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <div className="border rounded-lg p-4 h-[60vh] overflow-y-auto bg-white shadow">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-md max-w-[70%] text-sm whitespace-pre-wrap ${
              msg.sender === user.id
                ? "bg-green-100 self-end ml-auto"
                : "bg-gray-100"
            }`}
          >
            {msg.content}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
