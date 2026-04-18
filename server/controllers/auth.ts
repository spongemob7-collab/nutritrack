import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { mockDB } from "../mockDB.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, age, gender, weight, height, goal } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const userData = { email, password: hashedPassword, name, age, gender, weight, height, goal };
    let userId;

    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "User already exists" });

      const newUser = new User(userData);
      await newUser.save();
      userId = newUser._id;
    } else {
      // Use Mock DB
      if (mockDB.users.find(u => u.email === email)) {
        return res.status(400).json({ error: "User already exists" });
      }
      userId = "mock_" + Date.now();
      mockDB.users.push({ ...userData, _id: userId });
    }

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { _id: userId, name, email, goal } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let user;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
    } else {
      user = mockDB.users.find(u => u.email === email);
    }

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, goal: user.goal } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
