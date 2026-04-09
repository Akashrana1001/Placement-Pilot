import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Map, Mic, Terminal, Monitor, Bell, Users, ExternalLink } from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const links = user?.role === 'student' 
    ? [
        { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/app/plan", icon: Map, label: "Battle Plan" },
        { to: "/app/interview", icon: Mic, label: "Mock Interview" },
        { to: "/app/traces", icon: Terminal, label: "Traces" },
      ]
    : [
        { to: "/app/tpc", icon: Monitor, label: "Command Center" },
        { to: "/app/tpc/alerts", icon: Bell, label: "Alerts" },
        { to: "/app/tpc/students", icon: Users, label: "Students" },
        { to: "/app/tpc/traces", icon: Terminal, label: "Traces" },
      ];

  return (
    <aside 
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] glassmorphism border-y-0 border-l-0 rounded-none transition-all duration-300 z-40 flex flex-col ${expanded ? 'w-60' : 'w-16'}`}
    >
      <div className="flex-1 py-6 flex flex-col gap-2 px-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan' : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}>
            <Icon className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0 overflow-hidden'}`}>{label}</span>
          </NavLink>
        ))}
      </div>
      <div className="p-3 border-t border-white/10">
        <a href="http://localhost:5000/admin/queues" target="_blank" rel="noreferrer" className="flex items-center gap-4 px-3 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <ExternalLink className="w-5 h-5 shrink-0" />
          <span className={`whitespace-nowrap transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0 overflow-hidden'}`}>Queue Dashboard</span>
        </a>
      </div>
    </aside>
  );
};