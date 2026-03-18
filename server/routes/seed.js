import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();

// resolve correct directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/challenges", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const filePath = join(__dirname, "../data/challenges.json");

    const challenges = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    await db.collection("challenges").deleteMany({ createdBy: "seed" });

    const result = await db
      .collection("challenges")
      .insertMany(challenges);

    res.json({
      message: "Seeded successfully",
      count: result.insertedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Seeding failed" });
  }
});

export default router;