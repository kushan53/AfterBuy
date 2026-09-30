import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, Plus, Store, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { INDIAN_STORES } from '../../data/indianStores';
import { cn } from '../../utils/cn';

// Helper to generate elegant 2-letter monogram
const getMonogram = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'ST';
};

// Subtle color accents for store monograms
const MONOGRAM_COLORS = [
  'from-blue-600 to-indigo-600 text-white',
  'from-violet-600 to-purple-600 text-white',
  'from-amber-500 to-orange-600 text-white',
  'from-emerald-500 to-teal-600 text-white',
  'from-rose-500 to-pink-600 text-white',
  'from-cyan-500 to-blue-600 text-white',
];

const getColorForName = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return MONOGRAM_COLORS[Math.abs(hash) % MONOGRAM_COLORS.length];
};

export const SearchableStoreSelect = ({
  value,
  onChange,
  onStoreChange,
  label = 'Store / Merchant',
  error,
  helperText,
  placeholder = 'Search 70+ stores or type custom name...',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync external value
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered stores
  const filteredStores = useMemo(() => {
    let list = INDIAN_STORES;
    if (selectedCategory !== 'All') {
      list = list.filter((s) => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    const q = inputValue.toLowerCase().trim();
    if (!q) return list;

    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q))
    );
  }, [inputValue, selectedCategory]);

  // Check if current text matches an existing store name exactly
  const exactMatchExists = useMemo(() => {
    const q = inputValue.toLowerCase().trim();
    if (!q) return false;
    return INDIAN_STORES.some((s) => s.name.toLowerCase() === q);
  }, [inputValue]);

  // Handle selecting a store from list
  const handleSelectStore = (store) => {
    setInputValue(store.name);
    onChange(store.name);
    if (onStoreChange) {
      onStoreChange(store);
    }
    setIsOpen(false);
  };

  // Handle committing custom store typed by user
  const handleCommitCustom = (nameToCommit) => {
    const trimmed = (nameToCommit || inputValue).trim();
    if (!trimmed) return;
    setInputValue(trimmed);
    onChange(trimmed);
    if (onStoreChange) {
      onStoreChange({
        name: trimmed,
        category: 'Custom Store',
        defaultReturnDays: 7,
        returnPortalUrl: '',
        isCustom: true,
      });
    }
    setIsOpen(false);
  };

  const categories = ['All', 'Marketplace', 'Electronics', 'Fashion', 'Footwear', 'Beauty', 'Home'];

  return (
    <div className={cn("w-full flex flex-col space-y-1.5 relative", className)} ref={containerRef}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-[#A9B0BC] select-none flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{label}</span>
          </label>
          <span className="text-[10px] text-slate-400 dark:text-[#747C89] font-medium">
            Type anything or browse presets
          </span>
        </div>
      )}

      {/* Primary Unified Combobox Input */}
      <div
        className={cn(
          "relative flex items-center rounded-xl border transition-all duration-200 bg-white dark:bg-[#13161C]",
          isOpen
            ? "border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-500/20 shadow-sm"
            : "border-slate-200 dark:border-[#292E38] hover:border-slate-300 dark:hover:border-[#383F4D]",
          error && "border-rose-400 dark:border-rose-500/80 ring-rose-500/10"
        )}
      >
        {/* Left Monogram / Store Icon */}
        <div className="pl-3 pr-2 flex items-center pointer-events-none">
          {inputValue && exactMatchExists ? (
            <div className={cn("w-6 h-6 rounded-lg bg-gradient-to-tr text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs", getColorForName(inputValue))}>
              {getMonogram(inputValue)}
            </div>
          ) : (
            <Store className="w-4 h-4 text-slate-400 dark:text-[#747C89]" />
          )}
        </div>

        {/* Real Single Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            const val = e.target.value;
            setInputValue(val);
            onChange(val);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (filteredStores.length > 0 && exactMatchExists) {
                handleSelectStore(filteredStores[0]);
              } else if (inputValue.trim()) {
                handleCommitCustom(inputValue.trim());
              }
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          placeholder={placeholder}
          className="w-full py-2.5 pr-14 text-xs sm:text-sm text-slate-900 dark:text-[#F5F7FA] bg-transparent focus:outline-none placeholder-slate-400 font-medium"
        />

        {/* Right Action Buttons */}
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {inputValue && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setInputValue('');
                onChange('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) inputRef.current?.focus();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180 text-blue-600 dark:text-blue-400")} />
          </button>
        </div>
      </div>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-[min(440px,calc(100vw-2rem))] sm:w-[440px] max-w-full min-w-0 mt-2 z-50 rounded-2xl border border-slate-200/90 dark:border-[#282E39] bg-white dark:bg-[#151820] shadow-2xl shadow-slate-900/15 dark:shadow-black/70 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Top Category Filter Bar */}
          <div className="p-2.5 border-b border-slate-100 dark:border-[#22262F] flex items-center gap-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer",
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1F2430]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* If what is typed is NOT an exact preset match, show instant Custom Store Creation option */}
          {inputValue.trim() && !exactMatchExists && (
            <div className="p-2 border-b border-slate-100 dark:border-[#22262F] bg-blue-50/60 dark:bg-blue-950/25">
              <button
                type="button"
                onClick={() => handleCommitCustom(inputValue)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1B202C] border border-blue-200 dark:border-blue-800/80 hover:border-blue-400 dark:hover:border-blue-600 transition-colors text-left shadow-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] truncate">
                      Use &quot;{inputValue.trim()}&quot;
                    </div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400">
                      Add as custom store with return & refund tracking
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/80 px-2 py-1 rounded-md shrink-0 ml-2">
                  Select ↵
                </span>
              </button>
            </div>
          )}

          {/* List of Stores */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-[#22262F]/60 text-xs">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => {
                const isSelected = value?.toLowerCase() === store.name.toLowerCase();
                const monogram = getMonogram(store.name);
                const colorGradient = getColorForName(store.name);

                return (
                  <div
                    key={store.name}
                    onClick={() => handleSelectStore(store)}
                    className={cn(
                      "px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors group",
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold"
                        : "hover:bg-slate-50 dark:hover:bg-[#1A1E29] text-slate-800 dark:text-[#F5F7FA]"
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={cn("w-7 h-7 rounded-lg bg-gradient-to-tr text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs", colorGradient)}>
                        {monogram}
                      </div>

                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-[#F5F7FA] truncate flex items-center gap-1.5">
                          <span>{store.name}</span>
                          {store.popular && (
                            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-[#747C89] font-normal">
                          {store.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {store.defaultReturnDays && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#202531] text-slate-600 dark:text-[#A9B0BC]">
                          {store.defaultReturnDays}d return
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center space-y-2.5">
                <p className="text-xs text-slate-500 dark:text-[#A9B0BC]">
                  No preset store matching &quot;{inputValue}&quot;
                </p>
                <button
                  type="button"
                  onClick={() => handleCommitCustom(inputValue)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Use &quot;{inputValue}&quot; as store name</span>
                </button>
              </div>
            )}
          </div>

          {/* Refined Footer */}
          <div className="p-2.5 bg-slate-50/80 dark:bg-[#13161C]/80 border-t border-slate-100 dark:border-[#22262F] flex items-center justify-between text-[11px] text-slate-500 dark:text-[#747C89]">
            <span className="flex items-center gap-1">
              <span>💡</span>
              <span>Can&apos;t find your store? Type any custom name above.</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {filteredStores.length} stores
            </span>
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
