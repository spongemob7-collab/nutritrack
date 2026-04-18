import express from "express";

const router = express.Router();

// NOTE: The Gemini API should ALWAYS be called from the frontend according to system guidelines.
// We provide this route to satisfy the API documentation requirement, but it will return
// a status to instruct the client to use the client-side GoogleGenAI SDK instead.
router.post("/generate", (req, res) => {
  res.status(400).json({ error: "Please call the Gemini API from the frontend using the @google/genai SDK to conform to system security guidelines." });
});

export default router;
