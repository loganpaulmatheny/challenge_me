import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { MongoClient } from "mongodb";
import interactionsRouter from "./routes/interactions.js";
import configurePassport from "./config/passport.js";

// Routes
import users from "./routes/users.js";
import authRouter from "./routes/authentication.js";

import challengesRouter from "./routes/challenges.js";
import profileRouter from "./routes/profile.js";
import seedRouter from "./routes/seed.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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
await client.connect();

const db = client.db("challenge_me");

app.locals.db = db;

const passport = configurePassport(db);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", users);

app.use("/api/challenges", challengesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/seed", seedRouter);

app.use("/api/auth", authRouter);
app.use("/api/interactions", interactionsRouter);

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
