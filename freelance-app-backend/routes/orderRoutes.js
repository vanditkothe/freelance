import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { createOrder, getMyOrders, createOrderAfterPayment } from "../controllers/orderController.js";

const router = express.Router();

// POST /api/orders - Only clients (after Razorpay success)
router.post("/", auth, createOrder);

// GET /api/orders - For both clients and freelancers
router.get("/my-orders", auth, getMyOrders);
router.post("/create", auth, createOrderAfterPayment);

export default router;
