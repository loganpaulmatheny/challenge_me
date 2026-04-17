import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { MongoClient } from "mongodb";
import interactionsRouter from "./routes/interactions.js";
import configurePassport from "./config/passport.js";
import seedUsersRouter from "./routes/seedUsers.js";

// Routes
import users from "./routes/users.js";
import authRouter from "./routes/authentication.js";
import createAuthRouter from "./routes/authentication.js";

import challengesRouter from "./routes/challenges.js";
import profileRouter from "./routes/profile.js";
import seedRouter from "./routes/seed.js";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ADD THIS FIRST, before anything else
app.use((req, res, next) => {
  console.log("incoming request:", req.method, req.url);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
}
const db = client.db();

app.locals.db = db;

const passport = configurePassport(db);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", createAuthRouter(passport));

app.use("/api/users", users);

app.use("/api/challenges", challengesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/seed", seedRouter);

app.use("/api/auth", authRouter);
app.use("/api/interactions", interactionsRouter);
app.use("/api/seed-users", seedUsersRouter);
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// app.use("/", express.static("./client/dist"));
// app.get("*splat", (req, res) => {
//   res.sendFile("index.html", {
//     root: join(__dirname, "./client/dist"),
//   });
// });
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
