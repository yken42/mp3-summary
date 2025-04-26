import express from 'express';
import cookieParser from 'cookie-parser';
import geminiRouter from './routes/geminiRouter.js';
import connectToDatabase from './db/connectdb.js';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;


const allowedOrigins = [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:4000',  // Docker frontend
].filter(Boolean);  // Remove any undefined values

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api", geminiRouter);
app.use("/api/auth", authRoutes);

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});