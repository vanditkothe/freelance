import crypto from "crypto";
import { razorpay } from "../utils/razorpay.js";
import Order from "../models/Order.js"; // your Order model

// ------------------------------
// 1. Create Razorpay Order
// ------------------------------
export const createRazorpayOrder = async (req, res) => {
  const { amount, buyerId, gigId } = req.body;

  if (!amount || !buyerId || !gigId) {
    return res.status(400).json({ message: "Amount, buyerId, and gigId are required." });
  }

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        buyerId,
        gigId,
      },
    };

    const order = await razorpay.orders.create(options);

    // ✅ Send back only required fields
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ Error creating Razorpay order:", err);
    res.status(500).json({ message: "Failed to create Razorpay order", error: err.message });
  }
};


// ------------------------------
// 2. Razorpay Webhook Handler
// ------------------------------
export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const receivedSignature = req.headers["x-razorpay-signature"];
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (receivedSignature !== generatedSignature) {
    console.warn("⚠️ Invalid Razorpay webhook signature");
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const event = req.body;

  try {
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const { buyerId, gigId } = payment.notes;
      const sellerId = payment.notes.sellerId || null; // optional

      await Order.create({
        buyerId,
        sellerId,
        gigId,
        paymentId: payment.id,
        amount: payment.amount / 100,
        status: "paid",
      });

      console.log("✅ Order created for gig:", gigId);
    }

    res.status(200).json({ message: "Webhook received successfully" });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({ message: "Failed to process webhook", error: err.message });
  }
};
