// routes/reviewRoutes.js
import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { createReview, getReviewsForGig } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", auth, createReview);
router.get('/gig/:gigId', getReviewsForGig);

export default router;
