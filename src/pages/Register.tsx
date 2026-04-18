import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { apiFetch } from '../lib/api.ts';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: 25, gender: 'male', weight: 70, height: 175, goal: 'lose weight'
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e14] px-4 py-12">
      <div className="w-full max-w-xl bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/[0.08] shadow-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 mb-2">Create Account</h2>
        <p className="text-slate-400 mb-8">Set up your profile to start tracking</p>
        
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-400 mb-1">Age</label>
               <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
            </div>
             <div>
               <label className="block text-sm font-medium text-slate-400 mb-1">Gender</label>
               <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                 <option value="male">Male</option>
                 <option value="female">Female</option>
                 <option value="other">Other</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-400 mb-1">Weight (kg)</label>
               <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-400 mb-1">Height (cm)</label>
               <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: Number(e.target.value)})} className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
            </div>
            <div className="col-span-2">
               <label className="block text-sm font-medium text-slate-400 mb-1">Goal</label>
               <select value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                 <option value="lose weight">Lose Weight</option>
                 <option value="gain muscle">Gain Muscle</option>
                 <option value="maintain">Maintain</option>
               </select>
            </div>
          </div>
          
          <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-50 font-medium rounded-xl transition-colors mt-6">
            Create Account
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-emerald-400 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
