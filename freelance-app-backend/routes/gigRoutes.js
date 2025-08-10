import express from "express";
import {
  createGig,
  getAllGigs,
  getGigById,
  updateGig,
  deleteGig,
  getFreelancerGigs,
   searchGigsByCategory,
} from "../controllers/gigController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();



// 🔐 Protected Routes (Freelancer only)
router.get("/my-gigs", auth, getFreelancerGigs);
router.post("/", auth, createGig);            // POST /api/gigs
router.put("/:id", auth, updateGig);          // PUT /api/gigs/:id
router.delete("/:id", auth, deleteGig);       // DELETE /api/gigs/:id

// 🔓 Public Routes
router.get("/search", searchGigsByCategory);
router.get("/", getAllGigs);          // GET /api/gigs
router.get("/:id", getGigById);       // GET /api/gigs/:id


export default router;
