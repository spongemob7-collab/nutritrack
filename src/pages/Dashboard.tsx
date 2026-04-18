import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api.ts';
import { motion } from 'motion/react';
import { Activity, Apple, Droplets, Flame } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

export default function Dashboard() {
  const [meals, setMeals] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch('/meals').catch(() => []),
      apiFetch('/workouts').catch(() => [])
    ]).then(([mealsData, workoutsData]) => {
      setMeals(mealsData);
      setWorkouts(workoutsData);
    });
  }, []);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayMeals = meals.filter(m => format(new Date(m.date), 'yyyy-MM-dd') === todayStr);
  const todayWorkouts = workouts.filter(w => format(new Date(w.date), 'yyyy-MM-dd') === todayStr);

  const caloriesConsumed = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const caloriesBurned = todayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  
  // Create mock chart data based on last 7 days from our data
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dStr = format(d, 'yyyy-MM-dd');
    const dMeals = meals.filter(m => format(new Date(m.date), 'yyyy-MM-dd') === dStr);
    const dWorkouts = workouts.filter(w => format(new Date(w.date), 'yyyy-MM-dd') === dStr);
    
    return {
      name: format(d, 'EEE'),
      consumed: dMeals.reduce((sum, m) => sum + m.calories, 0),
      burned: dWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Calories In", value: caloriesConsumed, icon: Apple, color: "text-emerald-400" },
          { title: "Calories Out", value: caloriesBurned, icon: Flame, color: "text-orange-400" },
          { title: "Active Min", value: todayWorkouts.reduce((sum, w) => sum + w.duration, 0), icon: Activity, color: "text-blue-400" },
          { title: "Water", value: "1.5L", icon: Droplets, color: "text-cyan-400" } // Hardcoded for preview
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-semibold text-xs uppercase tracking-wide">{stat.title}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold tracking-tight">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08]"
        >
          <h2 className="text-lg font-bold mb-6">Calorie Balance (7 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBurned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#525252" tick={{fill: '#a3a3a3'}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="consumed" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#colorConsumed)" />
                <Area type="monotone" dataKey="burned" stroke="#fb923c" strokeWidth={2} fillOpacity={1} fill="url(#colorBurned)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Today's Macros</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Protein</span>
                 <span className="font-medium">{todayMeals.reduce((s, m) => s + m.protein, 0)}g</span>
               </div>
               <div className="h-2 bg-[#0b0e14] rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Carbs</span>
                 <span className="font-medium">{todayMeals.reduce((s, m) => s + m.carbs, 0)}g</span>
               </div>
               <div className="h-2 bg-[#0b0e14] rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Fats</span>
                 <span className="font-medium">{todayMeals.reduce((s, m) => s + m.fats, 0)}g</span>
               </div>
               <div className="h-2 bg-[#0b0e14] rounded-full overflow-hidden">
                 <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }}></div>
               </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
