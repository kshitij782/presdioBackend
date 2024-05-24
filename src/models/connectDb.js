import mongoose from "mongoose";

export async function dbConnect() {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://Rajgupta153:NSaWNLJRch89a0Wz@cluster0.jrcewq9.mongodb.net/Rentify?retryWrites=true&w=majority"
    );
    console.log("Connected to db");
    return connection;
  } catch (error) {
    console.log("Error in connecting db", error.message);
  }
}
