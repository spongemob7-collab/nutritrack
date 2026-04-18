import express from "express";
import { getMeals, addMeal } from "../controllers/meals.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getMeals as any);
router.post("/", authenticate, addMeal as any);

export default router;
