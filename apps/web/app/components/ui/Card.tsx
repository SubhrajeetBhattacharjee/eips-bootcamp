import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = true, glass = true }) => {
  const baseStyles = 'rounded-2xl border border-border p-5 transition-all duration-300';
  const glassStyles = glass ? 'bg-white/[0.02] backdrop-blur-sm' : 'bg-card';
  const hoverStyles = hoverable ? 'hover:border-emerald-500/20 hover:bg-white/[0.04]' : '';

  return (
    <div className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
