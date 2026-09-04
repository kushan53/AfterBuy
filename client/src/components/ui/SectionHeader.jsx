import React from 'react';
import { cn } from '../../utils/cn';

export const SectionHeader = ({
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-[#22262F] mb-6", className)}>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-[#F5F7FA]">{title}</h2>
        {description && (
          <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
    </div>
  );
};
