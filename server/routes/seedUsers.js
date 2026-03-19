import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", async (req, res) => {
  const db = req.app.locals.db;

  //   if (!req.user || req.user.role !== "admin") {
  //     return res.status(403).json({ message: "Unauthorized" });
  //   }

  try {
    const users = await db.collection("Users").find().toArray();
    const challenges = await db.collection("challenges").find().toArray();

    if (!users.length || !challenges.length) {
      return res.status(400).json({ message: "Missing users or challenges" });
    }

    // 1. UPDATE CHALLENGES → ASSIGN CREATEDBY USER
    const bulkOps = challenges.map((c) => {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      return {
        updateOne: {
          filter: { _id: c._id },
          update: { $set: { createdBy: randomUser._id } },
        },
      };
    });

    await db.collection("challenges").bulkWrite(bulkOps);

    // 2. CREATE PROFILES
    for (const user of users) {
      const assignedChallenges = challenges
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      const savedChallenges = assignedChallenges.map((c) => ({
        challengeId: c._id,
        status: "Not Started",
        progress: c.steps.map((s) => ({
          stepId: s.id,
          completed: false,
          proofUrl: "",
        })),
        startedAt: null,
        completedAt: null,
      }));

      await db.collection("profiles").updateOne(
        { userId: user._id },
        {
          $set: {
            userId: user._id,
            xp: Math.floor(Math.random() * 200),
            level: 1,
            badges: [],
            savedChallenges,
          },
        },
        { upsert: true }
      );
    }

    // 3. CREATE INTERACTIONS
    const interactions = [];

    for (const user of users) {
      const liked = [...challenges]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

      liked.forEach((c) => {
        interactions.push({
          userId: user._id,
          challengeId: c._id,
          type: "like",
          createdAt: new Date(),
        });
      });

      const saved = [...challenges].sort(() => 0.5 - Math.random()).slice(0, 5);

      saved.forEach((c) => {
        interactions.push({
          userId: user._id,
          challengeId: c._id,
          type: "save",
          createdAt: new Date(),
        });
      });
    }

    await db.collection("interactions").deleteMany({});
    await db.collection("interactions").insertMany(interactions);

    res.json({
      message: "Users linked to challenges successfully",
      users: users.length,
      interactions: interactions.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed linking users" });
  }
});

export default router;
