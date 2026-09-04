import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  className,
  variant = 'neutral',
  size = 'medium',
  dot = false,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-md border tracking-tight";

  const variants = {
    neutral: "bg-slate-50 text-slate-700 border-slate-200/80 dark:bg-[#1C2028] dark:text-[#A9B0BC] dark:border-[#292E38]",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
    warning: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
    danger: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50",
    info: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50",
    purple: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/50",
  };

  const dotColors = {
    neutral: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-blue-500",
    purple: "bg-violet-500",
  };

  const sizes = {
    small: "text-[11px] px-2 py-0.5 gap-1",
    medium: "text-xs px-2.5 py-1 gap-1.5",
    large: "text-sm px-3 py-1.5 gap-2",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
};
