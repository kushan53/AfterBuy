import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  children,
  icon: Icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer active:scale-[0.98]";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs hover:shadow-md hover:shadow-blue-500/20 focus:ring-blue-500 border border-transparent dark:bg-blue-600 dark:hover:bg-blue-500 dark:active:bg-blue-700",
    secondary: "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 focus:ring-slate-400 border border-slate-200/60 dark:bg-[#1C2028] dark:hover:bg-[#232833] dark:active:bg-[#2A303D] dark:text-[#F5F7FA] dark:border-[#292E38]",
    ghost: "bg-transparent hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100/70 text-slate-600 focus:ring-blue-300 dark:text-[#A9B0BC] dark:hover:bg-[#1C2028] dark:hover:text-[#F5F7FA]",
    danger: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs hover:shadow-md hover:shadow-rose-500/20 focus:ring-rose-500 border border-transparent dark:bg-rose-600/90 dark:hover:bg-rose-600 dark:text-rose-50",
    outline: "bg-white hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs focus:ring-slate-300 dark:bg-[#171A21] dark:hover:bg-[#1C2028] dark:text-[#F5F7FA] dark:border-[#292E38] dark:hover:border-[#383F4D]",
  };

  const sizes = {
    small: "text-xs px-2.5 py-1.5 gap-1.5",
    medium: "text-sm px-3.5 py-2 gap-2",
    large: "text-base px-4.5 py-2.5 gap-2.5",
  };

  const iconSizes = {
    small: "w-3.5 h-3.5",
    medium: "w-4 h-4",
    large: "w-5 h-5",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className={iconSizes[size]} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={iconSizes[size]} />}
    </button>
  );
});

Button.displayName = 'Button';
