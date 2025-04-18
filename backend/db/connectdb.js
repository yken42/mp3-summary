import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.CONNECTION_STRING;
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error.stack);
    } finally {
        await client.close();
    }
}

export default connectToDatabase;
