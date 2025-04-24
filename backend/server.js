import express from 'express';
import cookieParser from 'cookie-parser';
import geminiRouter from './routes/geminiRouter.js';
import connectToDatabase from './db/connectdb.js';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
const app = express();
const PORT = 3000;

// aiPrompt();

app.use(cors({
    origin: 'http://localhost:4000',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api", geminiRouter);
app.use("/api/auth", authRoutes);
connectToDatabase();

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})