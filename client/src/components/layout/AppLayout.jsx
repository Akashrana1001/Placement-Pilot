import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './SideBar.jsx';

export const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-cyber-cyan">Initializing...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-navy-950 text-white flex">
      <Navbar />
      <Sidebar />
      <main className="flex-1 ml-16 mt-16 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};