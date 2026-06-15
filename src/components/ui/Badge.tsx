import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' | 'glass';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        {
          'bg-blue-500/10 text-blue-400 border border-blue-500/20': variant === 'default',
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': variant === 'success',
          'bg-amber-500/10 text-amber-500 border border-amber-500/20': variant === 'warning',
          'bg-red-500/10 text-red-500 border border-red-500/20': variant === 'error',
          'border border-white/20 text-slate-300': variant === 'outline',
          'bg-white/5 border border-white/10 text-emerald-400': variant === 'glass',
        },
        className
      )}
      {...props}
    />
  );
}
