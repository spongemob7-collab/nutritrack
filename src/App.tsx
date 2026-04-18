/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Meals from './pages/Meals.tsx';
import Workouts from './pages/Workouts.tsx';
import RecipeAI from './pages/RecipeAI.tsx';
import Navbar from './components/Navbar.tsx';

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-50 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-full h-[600px] bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_40%)] pointer-events-none" />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/recipes" element={<RecipeAI />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}
