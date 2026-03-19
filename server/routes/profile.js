import express from "express";
import { ObjectId } from "mongodb";
import { calculateLevel, checkBadges } from "../utils/level.js";

const router = express.Router();

// IMPORT challenge
router.post("/import/:challengeId", async (req, res) => {
  const db = req.app.locals.db;
  const userId = req.user._id;

  const challenge = await db.collection("challenges").findOne({
    _id: new ObjectId(req.params.challengeId),
  });

  const progress = challenge.steps.map((s) => ({
    stepId: s.id,
    completed: false,
    proofUrl: "",
  }));

  await db.collection("profiles").updateOne(
    { userId },
    {
      $push: {
        savedChallenges: {
          challengeId: challenge._id,
          status: "Not Started",
          progress,
        },
      },
    },
    { upsert: true }
  );

  res.sendStatus(200);
});

// COMPLETE STEP
router.put("/complete-step/:challengeId", async (req, res) => {
  const db = req.app.locals.db;
  const { stepId, proofUrl } = req.body;
  const userId = req.user._id;

  const challenge = await db.collection("challenges").findOne({
    _id: new ObjectId(req.params.challengeId),
  });

  const step = challenge.steps.find((s) => s.id === stepId);

  await db.collection("profiles").updateOne(
    {
      userId,
      "savedChallenges.challengeId": challenge._id,
    },
    {
      $set: {
        "savedChallenges.$.progress.$[step].completed": true,
        "savedChallenges.$.progress.$[step].proofUrl": proofUrl || "",
      },
      $inc: { xp: step.points },
    },
    {
      arrayFilters: [{ "step.stepId": stepId }],
    }
  );

  const profile = await db.collection("profiles").findOne({ userId });

  const level = calculateLevel(profile.xp);
  const badges = checkBadges(profile);

  await db
    .collection("profiles")
    .updateOne({ userId }, { $set: { level, badges } });

  const updatedProfile = await db.collection("profiles").findOne({ userId });

  const currentChallenge = updatedProfile.savedChallenges.find((c) =>
    c.challengeId.equals(challenge._id)
  );

  const allDone = currentChallenge?.progress.every((p) => p.completed);

  await db.collection("profiles").updateOne(
    {
      userId,
      "savedChallenges.challengeId": challenge._id,
    },
    {
      $set: {
        "savedChallenges.$.status": allDone ? "Completed" : "In Progress",
      },
    }
  );

  res.sendStatus(200);
});

// GET PROFILE
router.get("/", async (req, res) => {
  const db = req.app.locals.db;

  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const profile = await db.collection("profiles").findOne({
    userId: req.user._id,
  });

  res.json(profile || { xp: 0, level: 1, savedChallenges: [] });
});

router.get("/challenges", async (req, res) => {
  const db = req.app.locals.db;

  if (!req.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const userId = req.user._id;

  const profile = await db.collection("profiles").findOne({ userId });

  if (!profile || !profile.savedChallenges?.length) {
    return res.json([]);
  }

  const challengeIds = profile.savedChallenges.map((c) => c.challengeId);

  const challenges = await db
    .collection("challenges")
    .aggregate([
      {
        $match: {
          _id: { $in: challengeIds },
        },
      },
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
    ])
    .toArray();

  const enriched = challenges.map((ch) => {
    const saved = profile.savedChallenges.find((c) =>
      c.challengeId.equals(ch._id)
    );

    return {
      ...ch,
      status: saved.status,
      progress: saved.progress,
    };
  });

  res.json(enriched);
});

export default router;
