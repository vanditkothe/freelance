// config/cloudinaryStorage.js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "freelance_app_gigs",
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
  },
});
