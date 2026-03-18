// This is the password seed script for all the users in the DB

import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("challenge_me");

const hash = await bcrypt.hash("password123", 10);

const result = await db
  .collection("Users")
  .updateMany(
    { passwordHash: { $exists: false } },
    { $set: { passwordHash: hash } }
  );

console.log(`Updated ${result.modifiedCount} users`);
await client.close();
process.exit();
