import express from "express";
// bcrypt used in class
import bcrypt from "bcrypt";
import passport from "passport";
import userDB from "../db/UsersMongoDB.js";

// used in class
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// POST - REGEISTER
// DONE do this after login is working
router.post("/register", async (req, res) => {
  // 1. Check for existing user
  // 2. Hash password
  // 3. Save new user
  // 4. Redirect or respond
  try {
    const { username, name, profileImageUrl, email, password, city, state } =
      req.body;
    // Validation
    //  Check the DB if it's already there?
    if (!email || !password || !username || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userDB.findUserByEmail(email);
    if (existingUser) {
      // State conflict error
      return res.status(409).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user update this
    const newUser = await userDB.createUser({
      username,
      name,
      profileImageURL: profileImageUrl, // note the casing in your schema
      email,
      passwordHash: hashedPassword,
      bio: "",
      city,
      state,
      friendIds: [],
      createdAt: new Date(),
      stats: {
        totalCompleted: 0,
        totalAttempted: 0,
        points: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
      challenges: [],
    });

    // Don't send password back
    delete newUser.passwordHash;

    res.status(201).json({
      message: "User created successfully (password removed)",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST - LOGIN
router.post("/login", (req, res, next) => {
  // The email and password come in as the body
  passport.authenticate("local", (err, user) => {
    // Error if say DB is down
    if (err) return next(err);
    // Error if there's no user
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    // Success
    // Built in function that will call serializeUser which creates the session and sends cookie to the browser
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

// GET - CURRENT USER
router.get("/user", (req, res) => {
  // Express will read the cookie with passport running deserializer to lookup the user by _id stored in session
  // notice that isAuthenticated is called
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Not logged in" });
  res.json({ user: req.user });
});

// TODO: Logout functionality
// Logout endpoint
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }

    // destroy session completely
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "Session destruction failed",
          error: err.message,
        });
      }

      // clear cookie from browser
      res.clearCookie("connect.sid");

      res.json({ message: "Logout successful" });
    });
  });
});

export default router;
