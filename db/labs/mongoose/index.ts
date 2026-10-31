import "dotenv/config";
import mongoose from "mongoose";

export const mongooseDb = mongoose.createConnection(process.env.MONGO_DB_URL!);
