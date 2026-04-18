import express from "express";
import { getProfile } from "../controllers/user.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile as any);

export default router;
