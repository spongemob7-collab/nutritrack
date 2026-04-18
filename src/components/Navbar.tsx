import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { cn } from '../lib/utils.ts';
import { Activity, Apple, ChefHat, LayoutDashboard, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Meals', path: '/meals', icon: Apple },
    { name: 'Workouts', path: '/workouts', icon: Activity },
    { name: 'AI Recipe', path: '/recipes', icon: ChefHat },
  ];

  return (
    <nav className="bg-[#0b0e14]/80 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-slate-50" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-50">NutriTrack<span className="text-emerald-400">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex items-center gap-2 text-sm font-medium transition-colors",
                    isActive ? "text-emerald-400" : "text-slate-400 hover:text-slate-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-emerald-400"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-slate-400">
              {user?.name}
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-slate-50 transition-colors rounded-full hover:bg-white/10"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
