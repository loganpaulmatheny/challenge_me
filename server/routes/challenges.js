import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

const VALID_CATEGORIES = [
  // legacy seed slugs (kept for backward compat with existing DB docs)
  "food", "spots", "social", "arts", "shop",
  "explore", "outdoor", "fitness", "wellness", "creative", "cozy",
  // current frontend display names
  "Food & Drink", "Social", "Solo Adventures", "Outdoors", "Creative",
  "Cozy", "Slow Living", "Self Care", "Romantic",
  "City Exploration", "Hidden Gems", "Touristy (but fun)", "Neighborhood Walks",
  "Fitness", "Wellness", "Shopping", "Nightlife",
  "Books & Cafes", "Art & Museums", "Music & Events", "Photography",
  "Date Ideas", "Friends Hangout", "Group Activities", "Introvert Friendly",
  "Seasonal", "Rainy Day", "Winter", "Summer",
  "Challenges", "Mini Quests", "XP Boost",
];

const VALID_TIME_WINDOWS = [
  // legacy slugs
  "anytime", "weekend", "weekday", "morning",
  // current frontend display values
  "Under 1 hr", "1-2 hrs", "2-4 hrs", "Half Day",
  "Full Day", "Evening", "Night", "Weekend", "Multi-Day",
];

// GET all  —  optional filters: ?category=food&neighborhood=Back+Bay&timeWindow=weekend
router.get("/", async (req, res) => {
  const db = req.app.locals.db;

  const match = {};
  if (req.query.category    && VALID_CATEGORIES.includes(req.query.category))
    match.category = req.query.category;
  if (req.query.neighborhood)
    match.neighborhood = req.query.neighborhood;
  if (req.query.timeWindow  && VALID_TIME_WINDOWS.includes(req.query.timeWindow))
    match.timeWindow = req.query.timeWindow;

  const challenges = await db
    .collection("challenges")
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "Users",
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
          venue: 1,
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
          venue: 1,
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

  const { title, description, category, neighborhood, timeWindow, steps, venue } = req.body;

  if (!title?.trim())
    return res.status(400).json({ message: "Title is required" });
  if (!VALID_CATEGORIES.includes(category))
    return res.status(400).json({ message: `category must be one of: ${VALID_CATEGORIES.join(", ")}` });
  if (!VALID_TIME_WINDOWS.includes(timeWindow))
    return res.status(400).json({ message: `timeWindow must be one of: ${VALID_TIME_WINDOWS.join(", ")}` });
  if (!Array.isArray(steps) || steps.length === 0)
    return res.status(400).json({ message: "At least one step is required" });

  const challenge = {
    title: title.trim(),
    description: description?.trim() ?? "",
    category,
    neighborhood: neighborhood ?? "",
    timeWindow,
    steps,
    createdBy: req.user._id,
    createdAt: new Date(),
    stats: { saves: 0, completions: 0, likes: 0 },
  };

  // venue is optional — only attach for shop challenges or when explicitly provided
  if (venue?.name) {
    challenge.venue = {
      name: venue.name.trim(),
      type: venue.type?.trim() ?? "",
      address: venue.address?.trim() ?? "",
    };
  }

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
