import express from "express";
import usersDB from "../db/UsersMongoDB.js";
const router = express.Router();

// STARTER to connect the users to the dashboard and display something
// TODO: Change this to challenges for a given user
router.get("/users/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  // Add query if the filter has been editted
  const query = {};
  console.log("🏡 Received request for /api/issues", {
    page,
    pageSize,
    query,
  });

  try {
    const users = await usersDB.getUsers({ query, pageSize, page });
    res.json({
      users,
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Internal Server Error", users: [] });
  }
});

export default router;
