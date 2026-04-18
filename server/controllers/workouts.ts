import { Request, Response } from "express";
import mongoose from "mongoose";
import { Workout } from "../models/Workout.js";
import { mockDB } from "../mockDB.js";

export const getWorkouts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (mongoose.connection.readyState === 1) {
      const workouts = await Workout.find({ userId }).sort({ date: -1 });
      res.json(workouts);
    } else {
      const workouts = mockDB.workouts.filter(w => String(w.userId) === String(userId));
      res.json(workouts.reverse());
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const addWorkout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { type, duration, caloriesBurned } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const newWorkout = new Workout({ userId, type, duration, caloriesBurned });
      await newWorkout.save();
      res.status(201).json(newWorkout);
    } else {
      const newWorkout = {
        _id: "workout_" + Date.now(),
        userId, type, duration, caloriesBurned,
        date: new Date()
      };
      mockDB.workouts.push(newWorkout);
      res.status(201).json(newWorkout);
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
