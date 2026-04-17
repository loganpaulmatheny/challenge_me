import { MongoClient, ObjectId } from "mongodb";

function UsersMongoDB({
  // Change these back to challenge_me and Users resepectively
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

  // Check if User is in the DB
  me.findUserByEmail = async (email) => {
    const users = await connect();
    try {
      const res = users.findOne({ email });
      return res;
    } catch (err) {
      console.error("Error searching for user by email", err);
      throw err;
    }
  };

  // CREATE - Create User
  me.createUser = async (userData) => {
    const users = await connect();
    try {
      const result = await users.insertOne(userData);
      return { _id: result.insertedId, ...userData };
    } catch (err) {
      console.error("Error creating user", err);
      throw err;
    }
  };

  // UPDATE - Update User
  me.updateUser = async (userId, updatedData) => {
    const users = await connect();
    try {
      const result = await users.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { ...updatedData, modifiedAt: new Date() } },
        { returnDocument: "after" }
      );
      return result; // returns the updated document
    } catch (err) {
      console.error("Error updating user in MongoDB", err);
      throw err;
    }
  };

  // DELETE - Delete User
  me.deleteUser = async (userId) => {
    const users = await connect();
    try {
      return await users.deleteOne({ _id: new ObjectId(userId) });
    } catch (err) {
      console.error("Error deleting issue from the DB", err);
      throw err;
    }
  };

  // TODO: Delete legacy starter code from apartment
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

  return me;
}

const UsersMongo = UsersMongoDB();
export default UsersMongo;
