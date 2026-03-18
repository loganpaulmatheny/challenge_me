import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { MongoClient } from "mongodb";
import configurePassport from "./config/passport.js";
import * as dotenv from "dotenv";

// Routes
import users from "./routes/users.js";
import authRouter from "./routes/authentication.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("challenge_me");

const passport = configurePassport(db);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", users);
app.use("/api/auth", authRouter);

app.use("/", express.static("./client/dist"));
app.get("*splat", (req, res) => {
  res.sendFile("index.html", { root: join(__dirname, "./client/dist") });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
