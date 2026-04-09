import React from 'react';

export const StatusBadge = ({ variant = 'info', text, pulse = false }) => {
  const variants = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    danger: "bg-red-50 text-red-600 border-red-100",
    critical: "bg-red-100 text-red-700 border-red-200",
    info: "bg-sky-50 text-sky-600 border-sky-100"
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${variants[variant]}`}>
      {pulse && <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />}
      {text}
    </span>
  );
};