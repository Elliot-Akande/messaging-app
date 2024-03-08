import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";

export default async function () {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf("/"));

  await mongoose.connect(`${process.env.MONGO_URI}/testdb`);
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();

  return async () => {
    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
    await instance.stop();
  };
}
