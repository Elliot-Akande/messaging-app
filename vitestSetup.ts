import mongoose from "mongoose";
import { afterAll, beforeAll } from "vitest";

beforeAll(async () => {
  const uri = process.env["MONGO_URI"];
  if (!uri) throw new Error("MONGO_URI is undefined");

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
});
