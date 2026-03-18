import express from "express";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.post("/seed", async (req, res) => {
  const db = req.app.locals.db;

  const data = [];

  for (let i = 0; i < 1000; i++) {
    data.push({
      title: `Boston Challenge ${i}`,
      description: "Explore Boston",
      category: "food",
      neighborhood: "Back Bay",
      timeWindow: "weekend",
      steps: [
        { id: uuid(), title: "Visit Cafe", type: "visit", points: 10 },
        { id: uuid(), title: "Take Photo", type: "photo", points: 15 },
      ],
      createdBy: "admin",
      createdAt: new Date(),
      stats: { saves: 0, completions: 0, likes: 0 },
    });
  }

  await db.collection("challenges").insertMany(data);

  res.json({ message: "Seeded" });
});

export default router;