import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ children, variant = 'primary', size = 'md', isLoading, className = '', ...props }) => {
  const base = "font-medium transition-all duration-200 flex justify-center items-center gap-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2", lg: "px-6 py-3 text-lg" };
  const variants = {
    primary: "bg-gradient-to-r from-cyber-cyan to-cyber-blue text-navy-950 hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]",
    secondary: "bg-navy-700 text-white hover:bg-navy-600 border border-white/10",
    danger: "bg-danger/20 text-danger border border-danger/50 hover:bg-danger/30"
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};