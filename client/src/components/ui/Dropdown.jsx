import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const alignments = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-56 rounded-xl border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#1C2028] p-1.5 shadow-lg dark:shadow-2xl dark:shadow-black/60 animate-in fade-in zoom-in-95 duration-100",
            alignments[align],
            className
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  icon: Icon,
  danger = false,
  className,
  onClick,
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors text-left select-none cursor-pointer",
        danger
          ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          : "text-slate-700 dark:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#232833] hover:text-slate-900 dark:hover:text-white",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-75" />}
      {children}
    </button>
  );
};

export const DropdownSeparator = () => (
  <div className="my-1 h-px bg-slate-100 dark:bg-[#292E38]" />
);

export const DropdownLabel = ({ children, className }) => (
  <div className={cn("px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-[#747C89] select-none", className)}>
    {children}
  </div>
);
