// routes/savedGigsRoutes.js
import express from "express";
import { saveGig, unsaveGig, getSavedGigs } from "../controllers/savedGigController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:gigId", auth, saveGig);              
router.delete("/:gigId", auth, unsaveGig);          
router.get("/", auth, getSavedGigs);               


export default router;
