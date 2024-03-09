import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import httpError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "./passportSetup.js";
import session from "express-session";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up mongoose connection
mongoose.set("strictQuery", false);
main().catch((err) => console.error(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

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

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  let errMessage = "An error occurred";
  let statusCode = 500;
  if (httpError.isHttpError(err) && err.status < 500) {
    errMessage = err.message;
    statusCode = err.status;
  }
  res.status(statusCode);
  res.json({ err: errMessage });
});

export default app;
