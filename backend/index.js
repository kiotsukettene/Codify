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
import courseFieldRoutes from "./routes/courseField.route.js";
import cors from "cors";
import emailRoutes from "./routes/email.route.js";
import session from "express-session";
import passport from "passport";
import studentEventRoutes from "./routes/studentEvent.route.js";
import battleRoutes from "./routes/battle.route.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import Battle from "./models/battle.model.js";

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
  // console.log("Socket.IO auth attempt - Token from auth:", token ? "Provided" : "Missing");

  // Fallback to cookie if token is not in auth
  if (!token && socket.handshake.headers.cookie) {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    token = cookies.token;
    // console.log("Socket.IO auth attempt - Token from cookie:", token ? "Provided" : "Missing");
  }

  if (!token) {
    // console.error("Authentication error: No token provided");
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

io.on("connection", async (socket) => {
  const userId = socket.userId;
  connectedUsers.set(userId, socket.id);
  console.log("User connected:", userId, "Socket ID:", socket.id);

  try {
    // Deliver stored notifications - enhance the query to be more specific
    const battles = await Battle.find({
      $and: [
        {
          "notifications.playerId": userId,
          "notifications.read": false,
        },
        {
          $or: [
            { player1: userId },
            { player2: userId }
          ]
        }
      ]
    });

    console.log(`Found ${battles.length} battles with notifications for user ${userId}`);

    for (const battle of battles) {
      const notifications = battle.notifications.filter(
        n => n.playerId.toString() === userId && !n.read
      );

      for (const notification of notifications) {
        socket.emit("battleNotification", {
          type: notification.type,
          title: notification.title,
          message: notification.message,
          time: notification.time,
          battleId: battle.battleId,
          battleCode: battle.battleCode, // Add battleCode to the notification
        });

        // Mark as read
        await Battle.updateOne(
          { 
            battleId: battle.battleId, 
            "notifications._id": notification._id 
          },
          { 
            $set: { "notifications.$.read": true } 
          }
        );
      }
    }
  } catch (error) {
    console.error("Error delivering stored notifications:", error);
  }

  socket.on("joinBattleRoom", async (battleCode) => {
    try {
      // Check if socket is already in this room
      if (socket.rooms.has(battleCode)) {
        console.log(`User ${socket.userId} is already in battle room ${battleCode}`);
        return;
      }

      const battle = await Battle.findOne({ battleCode })
        .populate('player1', 'firstName lastName')
        .populate('player2', 'firstName lastName');

      if (!battle) {
        socket.emit("error", { message: "Battle not found" });
        return;
      }

      socket.join(battleCode);
      console.log(`User ${socket.userId} joined battle room ${battleCode}`);

      const isPlayer1 = battle.player1._id.toString() === socket.userId;
      const isPlayer2 = battle.player2._id.toString() === socket.userId;

      if (isPlayer1 || isPlayer2) {
        const player = isPlayer1 ? battle.player1 : battle.player2;
        const playerName = `${player.firstName} ${player.lastName}`;
        const message = `${playerName} has joined the battle!`;
        
        io.to(battleCode).emit("playerJoined", {
          battleId: battle._id,
          studentId: socket.userId,
          message
        });

        // Update battle's joinedPlayers if not already included
        if (!battle.joinedPlayers.includes(socket.userId)) {
          await Battle.findOneAndUpdate(
            { battleCode },
            { $addToSet: { joinedPlayers: socket.userId } }
          );
        }
      }
    } catch (error) {
      console.error("Error in joinBattleRoom:", error);
      socket.emit("error", { message: "Failed to join battle room" });
    }
  });

  socket.on("playerReady", async ({ battleCode, studentId }) => {
    try {
      const battle = await Battle.findOne({ battleCode })
        .populate('player1', 'firstName lastName')
        .populate('player2', 'firstName lastName');

      if (battle) {
        // Add to readyPlayers array if not already included
        if (!battle.readyPlayers?.includes(studentId)) {
          await Battle.findOneAndUpdate(
            { battleCode },
            { $addToSet: { readyPlayers: studentId } }
          );
        }

        const isPlayer1 = battle.player1._id.toString() === studentId;
        const player = isPlayer1 ? battle.player1 : battle.player2;
        const playerName = `${player.firstName} ${player.lastName}`;
        const message = `${playerName} is ready for battle!`;

        io.to(battleCode).emit("playerReady", {
          battleId: battle._id,
          studentId,
          message
        });
      }
    } catch (error) {
      console.error("Error in playerReady:", error);
      socket.emit("error", { message: "Failed to mark player as ready" });
    }
  });

  socket.on("professorStartBattle", ({ battleCode }) => {
    io.to(battleCode).emit("professorStartBattle");
  });

  // Add handler for leaving rooms
  socket.on("leaveBattleRoom", (battleCode) => {
    socket.leave(battleCode);
    console.log(`User ${socket.userId} left battle room ${battleCode}`);
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(userId);
    console.log("User disconnected:", userId);
  });

  // Add battle completion handler
  socket.on("battleComplete", ({ battleCode, winnerId, winnerName }) => {
    console.log(`Battle ${battleCode} completed. Winner: ${winnerName}`);
    // Broadcast to ALL users in the battle room INCLUDING the sender
    io.in(battleCode).emit("battleCompleted", { winnerId, winnerName });
  });

  socket.on("codeUpdate", ({ battleCode, playerId, code, language }) => {
    console.log(`Code update in battle ${battleCode} from player ${playerId}`);
    // Broadcast to all users in the battle room except sender
    socket.to(battleCode).emit("codeUpdate", { playerId, code, language });
  });

  socket.on("playerTyping", ({ battleCode, playerId }) => {
    console.log(`Player ${playerId} is typing in battle ${battleCode}`);
    // Broadcast typing status to all users in the battle room except sender
    socket.to(battleCode).emit("playerTyping", { playerId });
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
app.use("/api/courseFields", courseFieldRoutes);
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