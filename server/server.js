import express from "express";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";

const app = express();

// ✅ CORS configuration
app.use(cors({
  origin: "http://localhost:5173", // your Vite frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);

const PORT = process.env.PORT || 5000;

// Connect DB first, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process if DB connection fails
  });