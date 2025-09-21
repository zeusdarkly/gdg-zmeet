import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();

// Vercel veya local için port
const PORT = process.env.PORT || 3000;

// __dirname Vercel uyumu için
const __dirname = path.resolve();

// CORS ayarı
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "*" : "http://localhost:5173",
    credentials: true, // frontend cookie gönderebilir
  })
);

app.use(express.json());
app.use(cookieParser());

// API rotaları
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Production'da frontend'i serve et
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Test route
app.get("/server-test", (req, res) => {
  res.send("Server is running...");
});

// Server başlat
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
