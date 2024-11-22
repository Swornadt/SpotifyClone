import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to DB ${conn.connection.host}`);
    } catch (error) {
        console.log("Failed to connect to DB", error);
        process.exit(1);
    }
}