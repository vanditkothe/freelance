// controllers/reviewController.js
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Gig from "../models/Gig.js";

export const createReview = async (req, res) => {
  try {
    const { gigId, rating, comment } = req.body;
    const userId = req.user.id;

    const existingOrder = await Order.findOne({
      gigId,
      buyerId: userId,
      hasReviewed: false,
    });

    if (!existingOrder) {
      return res.status(403).json({ message: "No permission to review this gig" });
    }

    const existingReview = await Review.findOne({ gigId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this gig" });
    }

    const newReview = await Review.create({
      gigId,
      userId,
      rating,
      comment,
    });

    // Update Gig Stats
    await Gig.findByIdAndUpdate(gigId, {
      $inc: { totalStars: rating, starNumber: 1 },
    });

    // Mark order as reviewed
    existingOrder.hasReviewed = true;
    await existingOrder.save();

    res.status(201).json(newReview);
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ message: "Failed to create review" });
  }
};

export const getReviewsForGig = async (req, res) => {
  try {
    const { gigId } = req.query;
    const reviews = await Review.find({ gigId }).populate("userId", "name avatar");
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Fetch reviews error:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
