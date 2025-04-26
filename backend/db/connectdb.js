import mongoose from 'mongoose';
import 'dotenv/config';

// const uri = process.env.CONNECTION_STRING;

async function connectToDatabase() {
    try {
        if (!process.env.CONNECTION_STRING) {
            throw new Error('CONNECTION_STRING is not defined in environment variables');
        }
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

export default connectToDatabase;
