import Gig from "../models/Gig.js";
import { v2 as cloudinary } from "cloudinary";

// 🔐 Helper: Only freelancers can mutate gigs
const ensureFreelancer = (req, res) => {
  if (req.user.role !== "freelancer") {
    res.status(403).json({ message: "Only freelancers can perform this action." });
    return false;
  }
  return true;
};

/* ------------------------------------------------------------------ */
/* 📌 1. CREATE GIG                                                    */
/* ------------------------------------------------------------------ */
export const createGig = async (req, res) => {
  if (!ensureFreelancer(req, res)) return;

  try {
    const {
      title,
      shortDescription,
      description,
      category,
      price,
      deliveryTime,
      revisionNumber,
      features,
      cover,   // { url, public_id }
      images,  // [ { url, public_id }, ... ]
    } = req.body;

    if (!cover || !cover.url) {
      return res.status(400).json({ message: "Cover image is required." });
    }

    const newGig = await Gig.create({
      userId: req.user.id,
      title,
      shortDescription,
      description,
      category,
      price: Number(price),
      deliveryTime: Number(deliveryTime),
      revisionNumber: Number(revisionNumber),
      features,
      cover,
      images,
    });

    res.status(201).json(newGig);
  } catch (err) {
    console.error("❌ Error creating gig:", err);
    res.status(500).json({ message: err.message || "Failed to create gig" });
  }
};

/* ------------------------------------------------------------------ */
/* 📌 2. GET ALL GIGS (PUBLIC)                                         */
/* ------------------------------------------------------------------ */
export const getAllGigs = async (_req, res) => {
  try {
    const gigs = await Gig.find().populate("userId", "name");
    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch gigs", error: err.message });
  }
};

/* ------------------------------------------------------------------ */
/* 📌 3. GET GIG BY ID (PUBLIC)                                        */
/* ------------------------------------------------------------------ */
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("userId", "name");
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.status(200).json(gig);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch gig", error: err.message });
  }
};

/* ------------------------------------------------------------------ */
/* 📌 4. GET MY GIGS (FREELANCER)                                      */
/* ------------------------------------------------------------------ */
export const getFreelancerGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ userId: req.user.id }).populate("userId", "name");
    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch gigs", error: err.message });
  }
};

/* ------------------------------------------------------------------ */
/* 📌 5. UPDATE GIG                                                    */
/* ------------------------------------------------------------------ */
export const updateGig = async (req, res) => {
  if (!ensureFreelancer(req, res)) return;

  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You do not own this gig." });
    }

    const updatedGig = await Gig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedGig);
  } catch (err) {
    res.status(500).json({ message: "Failed to update gig", error: err.message });
  }
};

/* ------------------------------------------------------------------ */
/* 📌 6. DELETE GIG                                                    */
/* ------------------------------------------------------------------ */
export const deleteGig = async (req, res) => {
  if (!ensureFreelancer(req, res)) return;

  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You do not own this gig." });
    }

    /* 🔥 Delete images from Cloudinary */
    const allImages = [gig.cover, ...(gig.images || [])];

    await Promise.all(
      allImages.map(async (img) => {
        if (img?.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.warn(`⚠️ Cloudinary deletion failed for ${img.public_id}:`, err.message);
          }
        }
      })
    );

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gig and images deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete gig", error: err.message });
  }
};
// ✅ New search controller
export const searchGigsByCategory = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    const gigs = await Gig.find({
      category: { $regex: q, $options: "i" }, // case-insensitive match
    });

    res.json(gigs);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
