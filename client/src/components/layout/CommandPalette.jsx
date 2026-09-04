import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShoppingBag, RotateCcw, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { usePurchases } from '../../context/PurchaseContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { purchases } = usePurchases();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? purchases.slice(0, 6)
    : purchases.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.merchant.toLowerCase().includes(q) ||
          (p.orderId && p.orderId.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      });

  const handleSelect = (item) => {
    onClose();
    if (item.returnStatus === 'return_requested' || item.returnStatus === 'picked_up' || item.returnStatus === 'in_transit') {
      navigate('/app/returns');
    } else {
      navigate('/app/purchases');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-[3px] transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-50 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-2xl dark:shadow-black/70 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-100 dark:border-[#22262F]">
          <Search className="w-5 h-5 text-slate-400 dark:text-[#747C89] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search purchases, orders, merchants, electronics, fashion..."
            className="w-full bg-transparent px-3 py-4 text-sm text-slate-900 dark:text-[#F5F7FA] placeholder:text-slate-400 dark:placeholder:text-[#747C89] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-[#292E38] rounded px-1.5 py-0.5 ml-2">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-[#22262F]">
          {filtered.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#747C89]">
                {query.trim() ? 'Search Results' : 'Recent Purchases & Deadlines'}
              </div>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1C2028] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                      {item.returnStatus === 'return_requested' || item.returnStatus === 'picked_up' ? (
                        <RotateCcw className="w-4 h-4" />
                      ) : item.warrantyActive ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA] truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-[#747C89] flex items-center gap-1.5 mt-0.5">
                        <span>{item.merchant}</span>
                        <span>•</span>
                        <span>₹{item.price.toLocaleString('en-IN')}</span>
                        {item.orderId && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[10px]">{item.orderId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.isUrgentReturn || item.returnStatus === 'expiring' ? (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200/80 dark:border-amber-900/50 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Ends {item.deadlineText}
                      </span>
                    ) : item.returnStatus === 'eligible' ? (
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                        {item.deadlineText}
                      </span>
                    ) : item.returnStatus === 'picked_up' || item.returnStatus === 'return_requested' ? (
                      <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                        Return In Progress
                      </span>
                    ) : null}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-[#383E4C] group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 dark:text-[#747C89] text-xs">
              No orders found matching "<span className="font-semibold text-slate-600 dark:text-slate-300">{query}</span>"
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#13161C] border-t border-slate-100 dark:border-[#22262F] flex items-center justify-between text-[11px] text-slate-400 dark:text-[#747C89]">
          <span>Tip: Click an item to jump directly to its tracker</span>
          <div className="flex items-center gap-3">
            <span><strong>↵</strong> to select</span>
            <span><strong>esc</strong> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
