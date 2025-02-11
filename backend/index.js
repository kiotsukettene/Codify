import express  from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './database/connectDB.js';
import authRoutes from './routes/auth.route.js'; 
import studentRoutes from './routes/student.route.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json()); // allows us to parse incoming request with JSON payloads (req.body)
app.use(cookieParser()); // allows us to parse cookies from the incoming request headers

// ✅ Handle CORS Preflight Requests
app.options("*", cors());


app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port', PORT);
});


// app.use("/admin", adminRoutes)

