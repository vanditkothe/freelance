import Order from "../models/Order.js";
import Gig from "../models/Gig.js";

// ✅ Middleware Helper — Only allow clients to place orders
const ensureClient = (req, res) => {
  if (req.user.role !== "client") {
    res.status(403).json({ message: "Only clients can place orders." });
    return false;
  }
  return true;
};

// ✅ Create Order — Called after Razorpay payment success (manual or webhook-based)
export const createOrder = async (req, res) => {
  const { gigId, paymentId, orderId, signature, amount } = req.body;

  if (!gigId || !paymentId || !orderId || !signature || !amount) {
    return res.status(400).json({ message: "All payment details are required." });
  }

  try {
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const order = await Order.create({
      gigId,
      buyerId: req.user.id,
      sellerId: gig.userId,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      amount,
      status: "completed",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};


// ✅ Get Orders for Logged-in User (Client or Freelancer)
export const getMyOrders = async (req, res) => {
  try {
    const filter =
      req.user.role === "client"
        ? { buyerId: req.user.id }
        : { sellerId: req.user.id };

    const orders = await Order.find(filter)
      .populate("gigId", "title cover")
      .populate("sellerId", "name")
      .populate("buyerId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Fetch Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
// controllers/orderController.js


export const createOrderAfterPayment = async (req, res) => {
  const { gigId, sellerId, amount, paymentId } = req.body;
  const buyerId = req.user.id; // ⬅️ Comes from `authMiddleware`

  if (!gigId || !sellerId || !amount || !paymentId || !buyerId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const order = await Order.create({
      gigId,
      buyerId,
      sellerId,
      amount,
      paymentId,
      status: "paid",
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};
