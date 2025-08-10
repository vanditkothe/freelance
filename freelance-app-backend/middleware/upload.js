// middleware/upload.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

// 🌍 Load environment variables
dotenv.config();

// 🔐 Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Optional: Console message
if (
  cloudinary.config().cloud_name &&
  cloudinary.config().api_key &&
  cloudinary.config().api_secret
) {
  console.log("✅ Cloudinary connected successfully");
} else {
  console.warn("⚠️ Cloudinary credentials are missing or invalid");
}

// 🗃️ Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "freelanceHub_gigs", // ✅ Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

// 🚀 Export multer middleware using Cloudinary storage
export const upload = multer({ storage });
