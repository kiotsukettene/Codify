import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/connectDB.js";
import authRoutes from "./routes/auth.route.js";
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

//// Session middleware (Required for persistent login with Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

// // Initialize Passport authentication
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); // allows us to parse incoming request with JSON payloads (req.body)
app.use(cookieParser()); // allows us to parse cookies from the incoming request headers

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});
