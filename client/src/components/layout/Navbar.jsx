import React, { useEffect, useState } from 'react';
import { Rocket, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState('bg-gray-500');

  useEffect(() => {
    api.get('/health').then(() => setStatus('bg-success')).catch(() => setStatus('bg-critical'));
  }, []);

  return (
    <nav className="fixed top-0 w-full h-16 glassmorphism border-x-0 border-t-0 rounded-none z-50 flex items-center justify-between px-6 bg-navy-950/80">
      <div className="flex items-center gap-2">
        <Rocket className="w-6 h-6 text-cyber-cyan" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan to-cyber-blue">
          PlacementPilot
        </span>
      </div>
      
      {user && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status} animate-pulse`} title="System Status"></span>
          </div>
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <span className="text-sm font-medium">{user.name}</span>
            <span className={`text-xs px-2 py-1 rounded bg-white/10 ${user.role === 'tpc' ? 'text-warning' : 'text-cyber-cyan'}`}>
              {user.role.toUpperCase()}
            </span>
            <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};