import express from "express";
import usersDB from "../db/UsersMongoDB.js";

const router = express.Router();

// GET /api/users
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const query = {};
  console.log("🏡 Received request for /api/users", { page, pageSize, query });
  try {
    const users = await usersDB.getUsers({ query, pageSize, page });
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error", users: [] });
  }
});

// PUT /api/users/:id
router.put("/:id", async (req, res) => {
  if (!req.user || req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const { username, name, profileImageURL, bio, city, state } = req.body;
  try {
    const updated = await usersDB.updateUser(req.params.id, {
      username,
      name,
      profileImageURL,
      bio,
      city,
      state,
    });
    if (!updated) return res.status(404).json({ message: "User not found" });
    const { passwordHash, ...safeUser } = updated;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
