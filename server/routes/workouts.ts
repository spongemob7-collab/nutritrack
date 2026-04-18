import express from "express";
import { getWorkouts, addWorkout } from "../controllers/workouts.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getWorkouts as any);
router.post("/", authenticate, addWorkout as any);

export default router;
