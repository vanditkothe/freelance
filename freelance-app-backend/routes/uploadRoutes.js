import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { cloudinary } from "../utils/cloudinary.js";
import multer from "multer";

const router = express.Router();
const multerUpload = multer({ dest: "uploads/" });

// POST /api/upload
router.post("/", multerUpload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = await Promise.all(
      req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: "gig_images" })
      )
    );

    const files = uploadedFiles.map(file => ({
      url: file.secure_url,
      public_id: file.public_id
    }));

    console.log("Files uploaded:", files);
    res.status(200).json({ message: "Images uploaded", files });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});

// DELETE /api/upload?public_id=xyz
router.delete("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can delete images." });
    }

    const { public_id } = req.query;

    if (!public_id) {
      return res.status(400).json({ message: "Missing public_id" });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(500).json({ message: "Failed to delete from Cloudinary" });
    }

    // Respond with success message only; 'files' is undefined here and should not be returned
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Error deleting image", error: err.message });
  }
});

export default router;
