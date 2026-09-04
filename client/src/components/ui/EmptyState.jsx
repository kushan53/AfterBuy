import React from 'react';
import { cn } from '../../utils/cn';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#171A21] rounded-xl border border-dashed border-slate-200 dark:border-[#292E38]", className)}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-[#1C2028] text-slate-400 dark:text-[#747C89] mb-3 border border-slate-100 dark:border-[#292E38]">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-800 dark:text-[#F5F7FA]">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-slate-500 dark:text-[#A9B0BC] max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
