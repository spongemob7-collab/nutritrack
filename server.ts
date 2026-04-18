import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

// Routers
import authRouter from "./server/routes/auth.js";
import userRouter from "./server/routes/user.js";
import mealRouter from "./server/routes/meals.js";
import workoutRouter from "./server/routes/workouts.js";
import recipeRouter from "./server/routes/recipes.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Connect to DB if available
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB via Mongoose");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  } else {
    console.warn("⚠️ MONGODB_URI is not set in environment. Running in mock/in-memory mode for development.");
  }

  // --- API Routes ---
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/meals", mealRouter);
  app.use("/api/workouts", workoutRouter);
  app.use("/api/recipes", recipeRouter);
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- Vite / Static files middleware ---
  if (process.env.NODE_ENV !== "production") {
    // Development mode: Use Vite's development server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
