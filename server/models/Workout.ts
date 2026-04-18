import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Cardio', 'Strength'], required: true },
  duration: { type: Number, required: true }, // in minutes
  caloriesBurned: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export const Workout: mongoose.Model<any> = mongoose.models.Workout || mongoose.model("Workout", workoutSchema);
