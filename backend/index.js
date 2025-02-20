import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import studentRoutes from "./routes/student.route.js";
import professorRoutes from "./routes/professor.route.js";
import courseRoutes from "./routes/course.route.js";
import lessonRoutes from "./routes/lesson.route.js";
import activityRoutes from "./routes/activity.route.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  session({
    secret: process.env.JWT_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only true in production
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

app.use(express.json()); // allows us to parse incoming request with JSON payloads (req.body)
app.use(cookieParser()); // allows us to parse cookies from the incoming request headers
app.use(passport.initialize());
app.use(passport.session()); // ✅ Enable session for Google Login

// ✅ Handle CORS Preflight Requests
app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/activities", activityRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});

// app.use("/admin", adminRoutes)
