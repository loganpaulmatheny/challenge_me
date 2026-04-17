import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default function configurePassport(db) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          // Try to find the user in MongoDB based on their email
          // CHANGE THIS BACK FOR THE MAIN BRANCH to Users
          const user = await db.collection("Users").findOne({ email });
          if (!user)
            return done(null, false, { message: "User or password incorrect" });

          // If you find the user then compare the password to the hashed password
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid)
            return done(null, false, { message: "User or password incorrect" });

          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id.toString()));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db
        .collection("Users")
        .findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  return passport;
}
