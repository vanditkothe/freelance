// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Client
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Freelancer
      required: true,
    },
    // 🔐 Razorpay Payment Details
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
    },
    razorpaySignature: {
      type: String,
      required: true,
    },

    // 💰 Payment Amount
    amount: {
      type: Number,
      required: true,
    },

    // 📦 Order Status
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    hasReviewed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
