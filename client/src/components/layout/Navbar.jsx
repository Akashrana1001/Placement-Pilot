import React, { useEffect, useState } from 'react';
import { Rocket, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState('bg-slate-300');

  useEffect(() => {
    api.get('/health').then(() => setStatus('bg-emerald-400')).catch(() => setStatus('bg-red-400'));
  }, []);

  return (
    <nav className="fixed top-0 w-full h-16 bg-white/70 backdrop-blur-2xl border-b border-slate-100 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-sky-200/30">
          <Rocket className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-800">PlacementPilot</span>
      </div>
      
      {user && (
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status} animate-pulse`} title="System Status"></span>
          </div>
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
            <span className="text-sm font-medium text-slate-700">{user.name}</span>
            <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold
              ${user.role === 'tpc' 
                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                : 'bg-sky-50 text-sky-600 border border-sky-100'}`}>
              {user.role.toUpperCase()}
            </span>
            <button onClick={logout} className="text-slate-400 hover:text-slate-700 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};