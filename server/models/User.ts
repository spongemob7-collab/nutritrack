import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: Number,
  gender: String,
  weight: Number,
  height: Number,
  goal: { type: String, enum: ['lose weight', 'gain muscle', 'maintain'], default: 'maintain' },
  waterIntakeGoal: { type: Number, default: 2500 } // in ml
}, { timestamps: true });

export const User: mongoose.Model<any> = mongoose.models.User || mongoose.model("User", userSchema);
