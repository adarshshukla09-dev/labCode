import mongoose from "mongoose";

export const mongooseDb = mongoose.createConnection(
  process.env.MONGO_URL! ||
    "mongodb://root:mongo123@labcode-mongodb:27017/sqllab?authSource=admin",
);
