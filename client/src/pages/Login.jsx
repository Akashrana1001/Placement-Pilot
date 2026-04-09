import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { Rocket } from 'lucide-react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: 'priya@test.com', password: 'password123', role: 'student' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Login successful!");
      } else {
        await register(formData);
        toast.success("Registration successful!");
      }
      navigate('/app');
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-8 z-10">
        <Rocket className="w-10 h-10 text-cyber-cyan" />
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan to-cyber-blue">PlacementPilot</h1>
      </div>

      <GlassCard className="w-full max-w-md z-10 p-8">
        <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
          <button onClick={() => setIsLogin(true)} className={`text-lg font-medium transition-colors ${isLogin ? 'text-cyber-cyan' : 'text-gray-500 hover:text-white'}`}>Login</button>
          <button onClick={() => setIsLogin(false)} className={`text-lg font-medium transition-colors ${!isLogin ? 'text-cyber-cyan' : 'text-gray-500 hover:text-white'}`}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-cyan outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-cyan outline-none appearance-none">
                  <option value="student">Student</option>
                  <option value="tpc">TPC Admin</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-cyan outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-navy-900 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-cyan outline-none transition-colors" />
          </div>
          
          <Button type="submit" className="w-full mt-6">{isLogin ? 'Initialize Session' : 'Create Account'}</Button>
        </form>
      </GlassCard>
    </div>
  );
};