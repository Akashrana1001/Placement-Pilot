import React from 'react';

export const StatusBadge = ({ variant = 'info', text, pulse = false }) => {
  const variants = {
    success: "bg-success/20 text-success border-success/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    danger: "bg-danger/20 text-danger border-danger/30",
    critical: "bg-critical/20 text-critical border-critical/30",
    info: "bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs border flex items-center gap-1.5 ${variants[variant]}`}>
      {pulse && <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />}
      {text}
    </span>
  );
};