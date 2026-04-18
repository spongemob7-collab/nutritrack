const fs = require('fs');

function replaceInFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-neutral-900\/50/g, 'bg-black/20');
  content = content.replace(/bg-neutral-900\/80/g, 'bg-[#0b0e14]/80');
  content = content.replace(/bg-neutral-900(?!\/)/g, 'bg-[#0b0e14]');
  content = content.replace(/bg-neutral-800\/50/g, 'bg-white/[0.03]');
  content = content.replace(/bg-neutral-800\/30/g, 'bg-white/[0.03]');
  content = content.replace(/border-white\/5(?!\d)/g, 'border-white/[0.08]');
  content = content.replace(/border-white\/10/g, 'border-white/[0.08]');
  content = content.replace(/text-white/g, 'text-slate-50');
  content = content.replace(/text-neutral-400/g, 'text-slate-400');
  content = content.replace(/text-neutral-300/g, 'text-slate-300');
  content = content.replace(/text-neutral-500/g, 'text-slate-500');
  fs.writeFileSync(file, content);
}

const files = [
  'src/App.tsx',
  'src/components/Navbar.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Login.tsx',
  'src/pages/Register.tsx',
  'src/pages/Meals.tsx',
  'src/pages/Workouts.tsx',
  'src/pages/RecipeAI.tsx',
];

files.forEach(replaceInFile);
