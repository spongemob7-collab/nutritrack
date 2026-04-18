import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { mockDB } from "../mockDB.js";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(userId).select('-password');
    } else {
      user = mockDB.users.find(u => u._id === userId);
      if (user) {
        user = { ...user };
        delete user.password;
      }
    }

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
