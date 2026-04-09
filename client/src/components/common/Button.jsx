import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ children, variant = 'primary', size = 'md', isLoading, className = '', ...props }) => {
  const base = "font-semibold transition-all duration-200 flex justify-center items-center gap-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5", lg: "px-6 py-3 text-lg" };
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-300/30",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};