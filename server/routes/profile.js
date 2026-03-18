import express from "express";
import { ObjectId } from "mongodb";
import { calculateLevel, checkBadges } from "../utils/level.js";

const router = express.Router();

// IMPORT challenge
router.post("/import/:challengeId", async (req, res) => {
  const db = req.app.locals.db;
  const { userId } = req.body;

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
  const { userId, stepId, proofUrl } = req.body;

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

  await db.collection("profiles").updateOne(
    { userId },
    { $set: { level, badges } }
  );

  res.sendStatus(200);
});

export default router;