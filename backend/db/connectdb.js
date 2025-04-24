import mongoose from 'mongoose';
import 'dotenv/config';

const uri = process.env.CONNECTION_STRING;

async function connectToDatabase() {
    try {
        await mongoose.connect(uri);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

export default connectToDatabase;
