import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const db = req.app.locals.db;

  const challenges = await db
    .collection("challenges")
    .aggregate([
      {
        $lookup: {
          from: "Users", // collection name
          localField: "createdBy",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          neighborhood: 1,
          timeWindow: 1,
          steps: 1,
          stats: 1,
          createdAt: 1,
          createdBy: 1,

          creator: {
            _id: "$creator._id",
            username: "$creator.username",
            profileImageURL: "$creator.profileImageURL",
          },
        },
      },
    ])
    .toArray();

  res.json(challenges);
});

// GET one challenge
router.get("/:id", async (req, res) => {
  const db = req.app.locals.db;

  const result = await db
    .collection("challenges")
    .aggregate([
      { $match: { _id: new ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "Users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          neighborhood: 1,
          timeWindow: 1,
          steps: 1,
          stats: 1,

          creator: {
            username: "$creator.username",
            profileImageURL: "$creator.profileImageURL",
          },
        },
      },
    ])
    .toArray();

  res.json(result[0]);
});

// CREATE
router.post("/", async (req, res) => {
  const db = req.app.locals.db;

  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const challenge = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    neighborhood: req.body.neighborhood,
    timeWindow: req.body.timeWindow,
    steps: req.body.steps,
    createdBy: req.user._id,
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

// DELETE challenge (owner only)
router.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;

  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const challengeId = new ObjectId(req.params.id);

  const challenge = await db.collection("challenges").findOne({
    _id: challengeId,
  });

  if (!challenge) {
    return res.status(404).json({ message: "Not found" });
  }

  // check ownership
  if (!challenge.createdBy.equals(req.user._id)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // delete challenge
  await db.collection("challenges").deleteOne({ _id: challengeId });

  // remove from ALL profiles
  await db.collection("profiles").updateMany(
    {},
    {
      $pull: {
        savedChallenges: { challengeId },
      },
    }
  );

  // remove all interactions
  await db.collection("interactions").deleteMany({
    challengeId,
  });

  res.json({ success: true });
});

export default router;
