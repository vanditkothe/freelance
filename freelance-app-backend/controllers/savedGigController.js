// controllers/savedGigsController.js

import User from "../models/User.js";


export const saveGig = async (req, res) => {
  const { gigId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user.savedGigs.includes(gigId)) {
      user.savedGigs.push(gigId);
      await user.save();
    }
    res.status(200).json({ message: "Gig saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while saving gig" });
  }
};

export const unsaveGig = async (req, res) => {
  const { gigId } = req.params;
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { savedGigs: gigId },
    });
    res.status(200).json({ message: "Gig unsaved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while unsaving gig" });
  }
};

export const getSavedGigs = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("savedGigs");
    res.status(200).json(user.savedGigs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching saved gigs" });
  }
};
