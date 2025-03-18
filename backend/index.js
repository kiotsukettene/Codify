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
import studentCourseRoutes from "./routes/studentCourse.route.js";
import challengeRoutes from "./routes/challenge.route.js";
import cors from "cors";
import session from "express-session";
import passport from "passport";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://www.codifylms.me", // Production frontend
        "http://localhost:5173", // Local dev (Vite default port)
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use(express.json());
app.use(cookieParser());


// Handle CORS Preflight Requests
app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/activities", activityRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/students/courses", studentCourseRoutes);
app.use("/api/students/challenges", challengeRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});