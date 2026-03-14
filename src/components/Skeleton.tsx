import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const baseClasses = 'bg-white/5 animate-pulse';
  const variantClasses = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-xl',
    circle: 'h-12 w-12 rounded-full',
  }[variant];

  return <div className={`${baseClasses} ${variantClasses} ${className}`} />;
};

export const PlayerStatsSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    <Skeleton className="h-32 mb-6" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-28" />
      ))}
    </div>
  </div>
);
