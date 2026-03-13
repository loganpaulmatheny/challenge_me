import express from "express";
import usersDB from "../db/UsersMongoDB.js";
const router = express.Router();

// Sample data for users

// GET /retrieve all the users?
// router.get("/users", (req, res) => {
//   const query = req.query.q?.toLowerCase();
//   if (query) {
//     const filtered = users.filter((u) =>
//       u.username.toLowerCase().includes(query)
//     );
//     return res.json(filtered);
//   }
//   res.json(users);
// });

// GET DB
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

// router.post("/listings/create", (req, res) => {
//   console.log("POST /api/listings/create called", req.body);
//   const { title, price } = req.body;
//   if (!title || !price) {
//     return res.status(400).json({ error: "Title and price are required" });
//   }
//
//   const newListing = {
//     id: listings.length + 1,
//     title,
//     price,
//   };
//   listings.push(newListing);
//   res.status(201).json({ msg: "New listing created", data: newListing });
// });

export default router;
