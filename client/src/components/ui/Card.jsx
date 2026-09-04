import React from 'react';
import { cn } from '../../utils/cn';

export const Card = React.forwardRef(({
  className,
  variant = 'default',
  children,
  ...props
}, ref) => {
  const baseStyles = "bg-white dark:bg-[#171A21] rounded-xl border transition-all duration-150";

  const variants = {
    default: "border-slate-200/80 dark:border-[#292E38] shadow-xs",
    highlighted: "border-blue-200 bg-blue-50/20 shadow-xs ring-1 ring-blue-100 dark:border-blue-900/60 dark:bg-blue-950/20 dark:ring-blue-900/40",
    interactive: "border-slate-200/80 dark:border-[#292E38] shadow-xs hover:border-slate-300 dark:hover:border-[#383F4D] hover:shadow-sm cursor-pointer",
  };

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("p-5 border-b border-slate-100 dark:border-[#22262F] flex flex-col space-y-1.5", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn("font-semibold text-slate-900 dark:text-[#F5F7FA] leading-tight text-base tracking-tight", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn("text-xs text-slate-500 dark:text-[#A9B0BC]", className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-5 text-slate-700 dark:text-[#A9B0BC]", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn("p-5 pt-0 flex items-center border-t border-transparent dark:border-[#22262F]", className)} {...props}>
    {children}
  </div>
);
