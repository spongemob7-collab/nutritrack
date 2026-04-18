import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api.ts';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function Workouts() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Cardio', duration: 30, caloriesBurned: 0
  });

  const loadWorkouts = async () => {
    try {
      const data = await apiFetch('/workouts');
      setWorkouts(data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/workouts', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      setFormData({ type: 'Cardio', duration: 30, caloriesBurned: 0 });
      loadWorkouts();
    } catch(err) {
      alert("Failed to add workout");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-slate-50 px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> Add Workout
        </button>
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] space-y-4 overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-[#0b0e14] border border-white/[0.08] rounded-xl">
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Duration (min)</label>
              <input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full px-4 py-2 bg-[#0b0e14] border border-white/[0.08] rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Calories Burned</label>
              <input type="number" value={formData.caloriesBurned} onChange={e => setFormData({...formData, caloriesBurned: Number(e.target.value)})} className="w-full px-4 py-2 bg-[#0b0e14] border border-white/[0.08] rounded-xl" required />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-slate-50 px-6 py-2 rounded-xl transition-colors font-medium">
              Save Workout
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid gap-4">
        {workouts.map((workout, i) => (
          <motion.div 
            key={workout._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08]"
          >
            <div>
              <h3 className="font-bold text-lg">{workout.type}</h3>
              <p className="text-sm text-slate-400 mt-1">
                {format(new Date(workout.date), 'MMM d, h:mm a')}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center hidden sm:block">
                <div className="text-xs text-slate-400">Duration</div>
                <div className="font-medium text-sm">{workout.duration} min</div>
              </div>
              <div className="text-right text-orange-400 font-bold text-xl ml-4">
                {workout.caloriesBurned}
                <span className="text-xs font-normal text-orange-400/70 ml-1">kcal burned</span>
              </div>
            </div>
          </motion.div>
        ))}
        {workouts.length === 0 && (
          <div className="text-center py-12 text-slate-500">No workouts logged yet. Get moving!</div>
        )}
      </div>
    </div>
  );
}
