import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Select = React.forwardRef(({
  className,
  error,
  label,
  helperText,
  disabled,
  options = [],
  id,
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-slate-700 dark:text-[#A9B0BC] select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-lg border bg-white dark:bg-[#13161C] px-3 py-2 pr-9 text-sm text-slate-900 dark:text-[#F5F7FA] transition-colors cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-500/30 dark:focus:border-blue-500",
            error
              ? "border-rose-400 dark:border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-200 dark:border-[#292E38] hover:border-slate-300 dark:hover:border-[#383F4D]",
            disabled && "bg-slate-50 dark:bg-[#171A21] text-slate-400 dark:text-[#747C89] border-slate-200 dark:border-[#292E38] cursor-not-allowed",
            className
          )}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#171A21] text-slate-900 dark:text-[#F5F7FA]">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-[#747C89] absolute right-3 pointer-events-none" />
      </div>
      {error ? (
        <span className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-slate-500 dark:text-[#747C89]">{helperText}</span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
