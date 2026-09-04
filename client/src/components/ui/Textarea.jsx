import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef(({
  className,
  error,
  label,
  helperText,
  disabled,
  rows = 3,
  id,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-medium text-slate-700 select-none">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors resize-y",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
            : "border-slate-200 hover:border-slate-300",
          disabled && "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error ? (
        <span className="text-[11px] text-rose-500 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
