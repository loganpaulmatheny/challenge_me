import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const challenges = await db.collection("challenges").find().toArray();
  res.json(challenges);
});

// CREATE
router.post("/", async (req, res) => {
  const db = req.app.locals.db;

  const challenge = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    neighborhood: req.body.neighborhood,
    timeWindow: req.body.timeWindow,
    steps: req.body.steps,
    createdBy: "user",
    createdAt: new Date(),
    stats: {
      saves: 0,
      completions: 0,
      likes: 0,
    },
  };

  const result = await db.collection("challenges").insertOne(challenge);
  res.json(result);
});

// LIKE
router.post("/like/:id", async (req, res) => {
  const db = req.app.locals.db;

  await db
    .collection("challenges")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { "stats.likes": 1 } }
    );

  res.sendStatus(200);
});

router.post("/like/:id", async (req, res) => {
  const db = req.app.locals.db;

  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const userId = req.user._id;
  const challengeId = new ObjectId(req.params.id);

  const existing = await db.collection("interactions").findOne({
    userId,
    challengeId,
    type: "like",
  });

  if (existing) {
    // UNLIKE
    await db.collection("interactions").deleteOne({
      userId,
      challengeId,
      type: "like",
    });

    await db
      .collection("challenges")
      .updateOne({ _id: challengeId }, { $inc: { "stats.likes": -1 } });

    return res.json({ liked: false });
  } else {
    // LIKE
    await db.collection("interactions").insertOne({
      userId,
      challengeId,
      type: "like",
      createdAt: new Date(),
    });

    await db
      .collection("challenges")
      .updateOne({ _id: challengeId }, { $inc: { "stats.likes": 1 } });

    return res.json({ liked: true });
  }
});

export default router;
