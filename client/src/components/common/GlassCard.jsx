import React from 'react';

export const GlassCard = ({ children, className = '', title, icon: Icon }) => (
  <div className={`glassmorphism p-6 ${className}`}>
    {(title || Icon) && (
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
        {Icon && <Icon className="w-5 h-5 text-cyber-cyan" />}
        {title && <h3 className="text-lg font-semibold tracking-wide">{title}</h3>}
      </div>
    )}
    {children}
  </div>
);