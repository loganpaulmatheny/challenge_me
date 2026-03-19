import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET liked challenges for current user
router.get("/likes", async (req, res) => {
  const db = req.app.locals.db;

  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const userId = req.user._id;

  const likes = await db
    .collection("interactions")
    .find({ userId, type: "like" })
    .toArray();

  const likedIds = likes.map((l) => l.challengeId.toString());

  res.json(likedIds);
});

export default router;
