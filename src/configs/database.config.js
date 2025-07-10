import mongoose from "mongoose";
import { database } from "./env.config.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(database.mongoUri);
    console.log(
      `MongoDB Connected: DB HOST: ${connectionInstance.connection.host}\n`,
    );
  } catch (error) {
    console.error(
      `Error while connecting to Mongo: ${error?.message || error}`,
    );
    process.exit(1);
  }
};

export { connectDB };
