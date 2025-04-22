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
import emailRoutes from "./routes/email.route.js";
import session from "express-session";
import passport from "passport";
import studentEventRoutes from "./routes/studentEvent.route.js";
import battleRoutes from "./routes/battle.route.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie"; // Add cookie parser for Socket.IO

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://codifylms.vercel.app",
        "http://localhost:5173",
        "https://www.codifylms.me",
        "https://api.codifylms.me",
        "https://codifylms.me",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  let token = socket.handshake.auth.token;
  console.log("Socket.IO auth attempt - Token from auth:", token ? "Provided" : "Missing");

  // Fallback to cookie if token is not in auth
  if (!token && socket.handshake.headers.cookie) {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    token = cookies.token;
    console.log("Socket.IO auth attempt - Token from cookie:", token ? "Provided" : "Missing");
  }

  if (!token) {
    console.error("Authentication error: No token provided");
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Socket.IO auth success - Decoded JWT:", {
      studentId: decoded.studentId,
      professorId: decoded.professorId,
    });
    socket.userId = decoded.studentId || decoded.professorId;
    socket.userType = decoded.studentId ? "student" : "professor";
    next();
  } catch (err) {
    console.error("Socket.IO auth error:", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
});
// Store connected users
const connectedUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.userId;
  connectedUsers.set(userId, socket.id);
  console.log("User connected:", userId, "Socket ID:", socket.id, "Connected Users:", [...connectedUsers]);

  socket.on("joinBattleRoom", (battleId) => {
    socket.join(battleId);
    console.log(`User ${userId} joined battle room ${battleId}`);
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(userId);
    console.log("User disconnected:", userId, "Connected Users:", [...connectedUsers]);
  });
});

// Remainder of index.js remains unchanged
app.set("io", io);
app.set("connectedUsers", connectedUsers);

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://codifylms.vercel.app",
        "http://localhost:5173",
        "https://www.codifylms.me",
        "https://api.codifylms.me",
        "https://codifylms.me",
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
app.use("/api/events", studentEventRoutes);
app.use("/api/battles", battleRoutes);

app.use("/api/guest", emailRoutes);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});