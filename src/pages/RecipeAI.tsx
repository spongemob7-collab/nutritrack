import { useState } from 'react';
import { motion } from 'motion/react';
import { ChefHat, Sparkles, Clock, Flame, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAuth } from '../hooks/useAuth.tsx';
import { apiFetch } from '../lib/api.ts';

export default function RecipeAI() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients");
      return;
    }
    
    setLoading(true);
    setError("");
    setRecipes([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const userGoalStr = user?.goal ? `User's fitness goal is to ${user.goal}. Keep this in mind to suggest relevant macros/calories.` : "";

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are a professional nutritionist and chef. Create 3 healthy recipes using MAINLY the following ingredients: ${ingredients}. You can assume basic pantry staples (salt, pepper, oil, water) exist. ${userGoalStr} Include calories, steps, and preparation time.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                recipeName: { type: Type.STRING, description: "Name of the recipe" },
                prepTime: { type: Type.STRING, description: "Preparation time in minutes e.g., 15 mins" },
                calories: { type: Type.NUMBER, description: "Estimated calories per serving" },
                protein: { type: Type.NUMBER, description: "Estimated protein in grams" },
                ingredients: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["recipeName", "prepTime", "calories", "protein", "ingredients", "steps"]
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        setRecipes(parsed);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveAsMeal = async (recipe: any) => {
    try {
      await apiFetch('/meals', {
        method: 'POST',
        body: JSON.stringify({
          name: recipe.recipeName,
          category: 'Dinner', // Default mapping
          calories: recipe.calories,
          protein: recipe.protein,
          carbs: 0, // Mocked for now
          fats: 0
        })
      });
      alert("Meal saved to your dashboard!");
    } catch (err) {
      alert("Failed to save meal");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <ChefHat className="w-6 h-6 text-slate-50" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">AI Recipe Generator</h1>
      </div>

      <div className="bg-gradient-to-br from-blue-500/[0.08] to-emerald-500/[0.08] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] space-y-4">
        <label className="block text-lg font-medium">What ingredients do you have?</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            placeholder="e.g., chicken breast, rice, broccoli, garlic"
            className="flex-1 px-5 py-4 bg-[#0b0e14] border border-white/[0.08] rounded-2xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-lg"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-slate-50 px-8 py-4 rounded-2xl transition-colors font-bold text-lg whitespace-nowrap shadow-lg shadow-purple-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {recipes.map((recipe, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] flex flex-col relative overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <h2 className="text-xl font-bold mb-4 leading-tight">{recipe.recipeName}</h2>
            
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-400" /> {recipe.prepTime}
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" /> {recipe.calories} kcal
              </div>
            </div>

            <div className="space-y-4 mb-6 flex-1">
              <div>
                <h3 className="font-semibold text-emerald-400 text-sm uppercase tracking-wider mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {recipe.ingredients.map((ing: string, i: number) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 text-sm uppercase tracking-wider mb-2">Steps</h3>
                <ol className="list-decimal list-inside text-sm text-slate-300 space-y-2">
                  {recipe.steps.map((step: string, i: number) => (
                    <li key={i} className="pl-1">{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <button 
              onClick={() => saveAsMeal(recipe)}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/[0.08] rounded-xl transition-colors font-medium text-sm mt-auto"
            >
              Add to Diary
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
