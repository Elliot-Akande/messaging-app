import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import User, { UserDocument } from "./models/user.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRouter from "./routes/auth.js";

// Set up mongoose connection
mongoose.set("strictQuery", false);

main().catch((err) => console.error(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

// Configure passport
passport.use(
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const user = await User.findOne({ username }).exec();
      if (!user) return done(null, false);
      if (!user.validatePassword(password)) return done(null, false);
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

  if (isUserDocument(user)) done(null, user.id);
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

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

export default app;
