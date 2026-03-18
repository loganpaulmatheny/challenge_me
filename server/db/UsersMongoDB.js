import { MongoClient, ObjectId } from "mongodb";

function UsersMongoDB({
  dbName = "challenge_me",
  collectionName = "Users",
} = {}) {
  const me = {};
  const URI = process.env.MONGODB_URI;

  const client = new MongoClient(URI);
  let collection = null;

  // Change this to an async function to stop Mongo from creating a new client every function
  // Long term this is a question of when / do you ever close the connection
  const connect = async () => {
    if (!collection) {
      await client.connect();
      collection = client.db(dbName).collection(collectionName);
    }
    return collection;
  };

  me.getUsers = async ({ query = {}, pageSize = 20, page = 1 } = {}) => {
    const users = await connect();
    try {
      const data = await users
        .find(query)
        .sort({ modifiedAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .toArray();
      console.log("📈 Fetched issues from MongoDB", data.length);
      return data;
    } catch (err) {
      console.error("Error fetching issues from MongoDB", err);
      throw err;
    }
  };

  // Register endpoint
  // router.post("/register", async (req, res) => {
  //   try {
  //     const { email, password, name } = req.body;
  //
  //     // Validation
  //     if (!email || !password || !name) {
  //       return res.status(400).json({ message: "All fields are required" });
  //     }
  //
  //     // Check if user already exists
  //     const existingUser = findUserByEmail(email);
  //     if (existingUser) {
  //       return res.status(400).json({ message: "User already exists" });
  //     }
  //
  //     // Hash password
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //
  //     // Create user
  //     const user = createUser({
  //       email,
  //       passwordHash: hashedPassword,
  //       name,
  //     });
  //
  //     // Don't send password back
  //     delete user.password;
  //
  //     res.status(201).json({
  //       message: "User created successfully",
  //       user,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error: error.message });
  //   }
  // });

  //   me.createIssue = async (issue) => {
  //     const issues = await connect();
  //     try {
  //       return await issues.insertOne(issue);
  //     } catch (err) {
  //       console.error("Error inserting issue into MongoDB", err);
  //       throw err;
  //     }
  //   };
  //
  //   me.removeIssue = async (issueId) => {
  //     const issues = await connect();
  //     try {
  //       return await issues.deleteOne({ _id: new ObjectId(issueId) });
  //     } catch (err) {
  //       console.error("Error deleting issue from the DB", err);
  //       throw err;
  //     }
  //   };
  //
  //   me.updateIssueDB = async (issueId, updatedData) => {
  //     const issues = await connect();
  //     try {
  //       return await issues.updateOne(
  //         { _id: new ObjectId(issueId) },
  //         { $set: { ...updatedData, modifiedAt: new Date() } }
  //       );
  //     } catch (err) {
  //       console.error("MongoDB Update Error:", err);
  //       throw err;
  //     }
  //   };
  //
  //   // MARK - Counts from DB
  //   me.getCategoryCounts = async () => {
  //     const issues = await connect();
  //     try {
  //       // do an aggregation function within the database
  //       const data = await issues
  //         .aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])
  //         .toArray();
  //       return data;
  //     } catch (err) {
  //       console.error("Error fetching category counts", err);
  //       throw err;
  //     }
  //   };
  //
  return me;
}

const UsersMongo = UsersMongoDB();
export default UsersMongo;
