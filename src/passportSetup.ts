import createHttpError from "http-errors";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User, { UserDocument } from "./models/User.js";

passport.use(
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const user = await User.findOne({ username }).exec();
      if (!user) {
        return done(
          createHttpError(401, "No account is registered with this username.")
        );
      }
      if (!(await user.validatePassword(password))) {
        return done(createHttpError(401, "Incorrect password."));
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  const isUserDocument = (user: object): user is UserDocument => {
    return "username" in user && "password" in user;
  };

  if (isUserDocument(user)) {
    return done(null, user.id);
  }
  return done(new Error("invalid user object"));
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
