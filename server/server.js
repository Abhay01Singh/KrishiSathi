import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectCloudinary from "./config/cloudinary.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);
// app.use("/api/weather", weatherRouter);
// app.use("/api/land", landRouter);
// app.use("/api/forum", forumRouter);

// Connect to DB
try {
  await connectDB();
  console.log("Connected to Database");
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

await connectCloudinary();

// Create HTTP + Socket server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async (msg) => {
    const saved = await Message.create(msg);
    io.emit("receiveMessage", saved);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
