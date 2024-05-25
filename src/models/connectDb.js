import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export async function dbConnect() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to db");
    return connection;
  } catch (error) {
    console.log("Error in connecting db", error.message);
  }
}
