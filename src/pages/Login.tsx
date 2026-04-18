import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { apiFetch } from '../lib/api.ts';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e14] px-4">
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/[0.08] shadow-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 mb-2">Welcome back</h2>
        <p className="text-slate-400 mb-8">Enter your credentials to access your account</p>
        
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-white/[0.08] rounded-xl text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              required
            />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-50 font-medium rounded-xl transition-colors mt-2">
            Log In
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <Link to="/register" className="text-emerald-400 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
