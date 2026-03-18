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

  await db.collection("challenges").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $inc: { "stats.likes": 1 } }
  );

  res.sendStatus(200);
});

export default router;