import { Request, Response } from "express";
import mongoose from "mongoose";
import { Meal } from "../models/Meal.js";
import { mockDB } from "../mockDB.js";

export const getMeals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (mongoose.connection.readyState === 1) {
      const meals = await Meal.find({ userId }).sort({ date: -1 });
      res.json(meals);
    } else {
      const meals = mockDB.meals.filter(m => String(m.userId) === String(userId));
      res.json(meals.reverse());
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const addMeal = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, category, calories, protein, carbs, fats } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const newMeal = new Meal({ userId, name, category, calories, protein, carbs, fats });
      await newMeal.save();
      res.status(201).json(newMeal);
    } else {
      const newMeal = { 
        _id: "meal_" + Date.now(), 
        userId, name, category, calories, protein, carbs, fats, 
        date: new Date() 
      };
      mockDB.meals.push(newMeal);
      res.status(201).json(newMeal);
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
