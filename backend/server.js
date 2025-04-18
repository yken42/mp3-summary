import express from 'express';
import cookieParser from 'cookie-parser';
import geminiRouter from './routes/geminiRouter.js';
import connectToDatabase from './db/connectdb.js';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = 3000;

// aiPrompt();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api", geminiRouter);

connectToDatabase();

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})