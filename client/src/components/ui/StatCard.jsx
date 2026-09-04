import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export const StatCard = ({
  label,
  value,
  supportingText,
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  icon: Icon,
  className,
  onClick,
}) => {
  const trendColors = {
    positive: 'text-emerald-700 bg-emerald-50 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-850/50',
    negative: 'text-rose-700 bg-rose-50 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-850/50',
    neutral: 'text-slate-600 bg-slate-50 border-slate-200/80 dark:bg-[#1C2028] dark:text-[#A9B0BC] dark:border-[#292E38]',
    warning: 'text-amber-700 bg-amber-50 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-850/50',
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4.5 flex flex-col justify-between",
        onClick && "cursor-pointer hover:border-slate-300 dark:hover:border-[#383F4D] hover:shadow-xs transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">{label}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#1C2028] text-slate-500 dark:text-[#A9B0BC] border border-slate-100 dark:border-[#292E38]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-none">
          {value}
        </div>

        {(supportingText || trend) && (
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            {trend && (
              <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded border text-[11px] font-semibold", trendColors[trendType])}>
                {trend}
              </span>
            )}
            {supportingText && (
              <span className="text-slate-500 dark:text-[#747C89] text-[11px] truncate">{supportingText}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
