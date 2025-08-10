import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Route Imports
import authRoutes from './routes/authRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import savedGigRoutes from './routes/savedGigRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://freelance-one-omega.vercel.app',
];

// === Socket.IO Setup ===
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests like Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS error: Origin not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 New socket connected:", socket.id);

  socket.on("join", (userId) => {
    connectedUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        message,
        timestamp: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [key, value] of connectedUsers.entries()) {
      if (value === socket.id) connectedUsers.delete(key);
    }
    console.log("🔴 Disconnected:", socket.id);
  });
});

// === Middlewares ===
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS error: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// === MongoDB Connection with better error logging ===
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error("❌ MongoDB connection error:", err));

// === Static Files Setup ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/saved-gigs', savedGigRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', messageRoutes);

// === Default Route ===
app.get('/', (req, res) => {
  res.send('🎉 Freelance App Backend Running');
});

// === Start Server ===
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
