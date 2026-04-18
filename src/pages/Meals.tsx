import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api.ts';
import { motion } from 'motion/react';
import { Plus, Check } from 'lucide-react';
import { format } from 'date-fns';

export default function Meals() {
  const [meals, setMeals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'Breakfast', calories: 0, protein: 0, carbs: 0, fats: 0
  });

  const loadMeals = async () => {
    try {
      const data = await apiFetch('/meals');
      setMeals(data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/meals', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      setFormData({ name: '', category: 'Breakfast', calories: 0, protein: 0, carbs: 0, fats: 0 });
      loadMeals();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch(err) {
      alert("Failed to add meal");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Meals</h1>
        <motion.button 
          onClick={() => setShowForm(!showForm)}
          animate={isSuccess ? { scale: [1, 1.1, 1], backgroundColor: ['#10b981', '#059669', '#10b981'] } : {}}
          transition={{ duration: 0.5 }}
          className={`flex items-center gap-2 text-slate-50 px-4 py-2 rounded-xl transition-colors font-medium ${isSuccess ? 'bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
        >
          {isSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isSuccess ? "Saved!" : "Add Meal"}
        </motion.button>
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] space-y-4 overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Meal Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-[#0b0e14] border border-white/[0.08] rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 bg-[#0b0e14] border border-white/[0.08] rounded-xl">
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Calories (kcal)</label>
              <input type="number" value={formData.calories} onChange={e => setFormData({...formData, calories: Number(e.target.value)})} className="w-full px-4 py-2 bg-[#0b0e14] border border-white/[0.08] rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Protein (g)</label>
              <input type="number" value={formData.protein} onChange={e => setFormData({...formData, protein: Number(e.target.value)})} className="w-full px-4 py-2 bg-[#0b0e14] border border-white/[0.08] rounded-xl" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Carbs (g)</label>
              <input type="number" value={formData.carbs} onChange={e => setFormData({...formData, carbs: Number(e.target.value)})} className="w-full px-4 py-2 bg-[#0b0e14] border border-white/[0.08] rounded-xl" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Fats (g)</label>
              <input type="number" value={formData.fats} onChange={e => setFormData({...formData, fats: Number(e.target.value)})} className="w-full px-4 py-2 bg-[#0b0e14] border border-white/[0.08] rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-50 px-6 py-2 rounded-xl transition-colors font-medium">
              Save Meal
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid gap-4">
        {meals.map((meal, i) => (
          <motion.div 
            key={meal._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08]"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{meal.name}</h3>
                <span className="px-2 py-0.5 bg-white/5 text-slate-300 rounded-full text-xs font-medium">{meal.category}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {format(new Date(meal.date), 'MMM d, h:mm a')}
              </p>
            </div>
            
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <div className="text-center">
                <div className="text-xs text-slate-400">Protein</div>
                <div className="font-medium text-sm">{meal.protein}g</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">Carbs</div>
                <div className="font-medium text-sm">{meal.carbs}g</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400">Fats</div>
                <div className="font-medium text-sm">{meal.fats}g</div>
              </div>
              <div className="text-right text-emerald-400 font-bold text-xl ml-4">
                {meal.calories}
                <span className="text-xs font-normal text-emerald-400/70 ml-1">kcal</span>
              </div>
            </div>
          </motion.div>
        ))}
        {meals.length === 0 && (
          <div className="text-center py-12 text-slate-500">No meals logged yet. start tracking!</div>
        )}
      </div>
    </div>
  );
}
