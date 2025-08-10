import express from "express";
import { createRazorpayOrder, razorpayWebhook } from "../controllers/paymentController.js";
import { auth } from "../middleware/authMiddleware.js";


const router = express.Router();

// ✅ Route to create Razorpay order (calls controller)
router.post("/create-order", auth, createRazorpayOrder);

// ✅ Razorpay Webhook route (uses raw body parser)
router.post("/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

export default router;
