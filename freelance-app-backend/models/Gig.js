import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 5,
    },
    deliveryTime: {
      type: Number,
      required: true,
      min: 1,
    },
    revisionNumber: {
      type: Number,
      required: true,
      min: 0,
    },
    features: {
      type: [String],
    },
     totalStars: { type: Number, default: 0 },
     starNumber: { type: Number, default: 0 },

    // ✅ Update these two for Cloudinary
    cover: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    // Optional rating fields
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gig", gigSchema);
