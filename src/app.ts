import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from "./routes/index.js";

// Set up mongoose connection
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

main().catch((err) => console.error(err));
async function main() {
  const mongoDB = process.env.MONGO_URL;
  if (!mongoDB) throw new Error("MONGO_URL is undefined");
  await mongoose.connect(mongoDB);
}

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

export default app;
