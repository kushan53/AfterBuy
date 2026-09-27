import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Format ISO YYYY-MM-DD to human friendly "Sep 27, 2026"
export const formatDisplayDate = (isoStr) => {
  if (!isoStr) return '';
  try {
    const [year, month, day] = isoStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return isoStr;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return isoStr;
  }
};

export const AdvancedDatePicker = ({
  label,
  value, // 'YYYY-MM-DD'
  onChange,
  maxDate, // 'YYYY-MM-DD'
  minDate, // 'YYYY-MM-DD'
  presets = [],
  helperText,
  error,
  required,
  className,
  placeholder = 'Select date...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value or fallback
  const selectedDateObj = useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    const dObj = new Date(y, m - 1, d);
    return isNaN(dObj.getTime()) ? null : dObj;
  }, [value]);

  // Calendar View month & year state
  const [viewYear, setViewYear] = useState(() => {
    return selectedDateObj ? selectedDateObj.getFullYear() : new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    return selectedDateObj ? selectedDateObj.getMonth() : new Date().getMonth();
  });

  // Keep view in sync when value changes from outside
  useEffect(() => {
    if (selectedDateObj) {
      setViewYear(selectedDateObj.getFullYear());
      setViewMonth(selectedDateObj.getMonth());
    }
  }, [selectedDateObj]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Today check
  const todayStr = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  }, []);

  // Previous / Next Month
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Generate days matrix for calendar
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        dayNumber: daysInPrevMonth - i,
        isCurrentMonth: false,
        dateStr: `${viewMonth === 0 ? viewYear - 1 : viewYear}-${String(viewMonth === 0 ? 12 : viewMonth).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: true,
        dateStr: `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateStr: `${viewMonth === 11 ? viewYear + 1 : viewYear}-${String(viewMonth === 11 ? 1 : viewMonth + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  // Select day
  const handleSelectDate = (dateStr) => {
    if (maxDate && dateStr > maxDate) return;
    if (minDate && dateStr < minDate) return;

    onChange(dateStr);
    setIsOpen(false);
  };

  // Quick preset offsets
  const handlePresetClick = (daysOffset) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    handleSelectDate(dateStr);
  };

  // Generate Comprehensive Year Range (Future & Past: e.g. 2051 down to 1980)
  const currentActualYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const list = [];
    const futureLimit = currentActualYear + 25; // 25 years into future (e.g. 2051)
    const pastLimit = 1980; // 45+ years into past
    for (let y = futureLimit; y >= pastLimit; y--) {
      list.push(y);
    }
    return list;
  }, [currentActualYear]);

  const defaultPresets = [
    { label: 'Today', daysOffset: 0 },
    { label: 'Yesterday', daysOffset: -1 },
    { label: '3d ago', daysOffset: -3 },
    { label: '1w ago', daysOffset: -7 },
  ];

  const activePresets = presets.length > 0 ? presets : defaultPresets;

  return (
    <div className={cn("w-full flex flex-col space-y-1.5 relative", className)} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-[#A9B0BC] select-none flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Styled Interactive Trigger Button (Click to Open Calendar) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full rounded-xl border bg-white dark:bg-[#13161C] px-3.5 py-2.5 text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-between min-h-[42px]",
          "hover:border-slate-300 dark:hover:border-[#383F4D]",
          isOpen
            ? "border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-500/20 shadow-sm"
            : "border-slate-200 dark:border-[#292E38]",
          error && "border-rose-400 dark:border-rose-500/80 ring-rose-500/10"
        )}
      >
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>

          <span className={cn(
            "font-semibold truncate",
            value ? "text-slate-900 dark:text-[#F5F7FA]" : "text-slate-400"
          )}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180 text-blue-600 dark:text-blue-400")} />
        </div>
      </div>

      {/* Luxury Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full sm:w-[320px] rounded-2xl border border-slate-200/90 dark:border-[#282E39] bg-white/95 dark:bg-[#151820]/95 backdrop-blur-xl shadow-2xl shadow-slate-900/15 dark:shadow-black/70 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-4 space-y-3">
          
          {/* Quick Presets Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 dark:border-[#22262F]">
            {activePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.daysOffset)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-[#1F2430] hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 text-slate-600 dark:text-[#A9B0BC] transition-colors whitespace-nowrap cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Direct Fast Month & Year Dropdown Selectors */}
          <div className="flex items-center justify-between gap-2 px-0.5">
            <div className="flex items-center gap-1.5 flex-1">
              {/* 1-Click Fast Month Dropdown */}
              <div className="relative flex-1">
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="w-full appearance-none px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A303C] bg-slate-50 dark:bg-[#1C2028] text-xs font-bold text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-6"
                >
                  {MONTH_NAMES.map((mName, idx) => (
                    <option key={mName} value={idx} className="bg-white dark:bg-[#171A21] text-slate-900 dark:text-[#F5F7FA]">
                      {mName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 1-Click Fast Year Dropdown */}
              <div className="relative w-24">
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="w-full appearance-none px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A303C] bg-slate-50 dark:bg-[#1C2028] text-xs font-bold text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer pr-6"
                >
                  {yearOptions.map((yr) => (
                    <option key={yr} value={yr} className="bg-white dark:bg-[#171A21] text-slate-900 dark:text-[#F5F7FA]">
                      {yr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Left & Right Month Step Buttons */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-[#A9B0BC] dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1F2430] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-[#A9B0BC] dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1F2430] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Calendar Matrix */}
          <div className="space-y-1">
            {/* Weekday Names Header */}
            <div className="grid grid-cols-7 text-center">
              {DAYS_OF_WEEK.map((d) => (
                <span key={d} className="text-[11px] font-bold text-slate-400 dark:text-[#747C89] py-1">
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item, index) => {
                const isSelected = value === item.dateStr;
                const isToday = item.dateStr === todayStr;
                const isFutureDisabled = maxDate && item.dateStr > maxDate;
                const isPastDisabled = minDate && item.dateStr < minDate;
                const isDisabled = isFutureDisabled || isPastDisabled;

                return (
                  <button
                    key={`${item.dateStr}-${index}`}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelectDate(item.dateStr)}
                    className={cn(
                      "w-8 h-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center relative transition-all cursor-pointer",
                      isSelected
                        ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/25 scale-105"
                        : isToday
                        ? "border border-blue-500/50 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        : item.isCurrentMonth
                        ? "text-slate-800 dark:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1F2430]"
                        : "text-slate-300 dark:text-[#383F4D] hover:bg-slate-50 dark:hover:bg-[#1A1E27]",
                      isDisabled && "opacity-25 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    <span>{item.dayNumber}</span>
                    {isToday && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Bar with Active Date & Today Shortcut */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#22262F] flex items-center justify-between text-[11px]">
            <span className="text-slate-400 dark:text-[#747C89]">
              {value ? formatDisplayDate(value) : 'No date selected'}
            </span>
            <button
              type="button"
              onClick={() => handleSelectDate(todayStr)}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Set Today
            </button>
          </div>
        </div>
      )}

      {error ? (
        <span className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-slate-500 dark:text-[#747C89]">{helperText}</span>
      ) : null}
    </div>
  );
};
