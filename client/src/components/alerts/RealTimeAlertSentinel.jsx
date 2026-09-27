import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, ShieldAlert, ArrowRight, X, Sparkles } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';
import { Button } from '../ui/Button';

export const RealTimeAlertSentinel = () => {
  const navigate = useNavigate();
  const {
    permission,
    requestPermission,
    triggerTestAlert,
    urgentCount,
    urgentReturns,
    overdueRefunds,
  } = useAlerts();

  const [dismissed, setDismissed] = useState(false);

  // If dismissed or no urgent items and notifications already configured, don't show
  if (dismissed || urgentCount === 0) return null;

  const topUrgentReturn = urgentReturns[0];
  const topOverdueRefund = overdueRefunds[0];

  return (
    <div className="mb-6 rounded-2xl border border-amber-300/80 dark:border-amber-800/80 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 dark:from-amber-950/40 dark:via-amber-950/20 dark:to-rose-950/30 p-3.5 sm:p-4 shadow-sm backdrop-blur-xs relative animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        
        {/* Left: Pulsing Sentinel Badge & Alert Summary */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="relative shrink-0 mt-0.5 sm:mt-0">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                Live Sentinel Alert
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">
                {urgentCount} {urgentCount === 1 ? 'critical deadline requires' : 'critical deadlines require'} action
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] mt-0.5 truncate">
              {topUrgentReturn ? (
                <>
                  <strong className="text-slate-900 dark:text-white">{topUrgentReturn.name}</strong> return window {topUrgentReturn.deadlineText?.toLowerCase()} • Save ₹{topUrgentReturn.price?.toLocaleString('en-IN')}
                </>
              ) : topOverdueRefund ? (
                <>
                  <strong className="text-slate-900 dark:text-white">{topOverdueRefund.merchant}</strong> refund of ₹{topOverdueRefund.amount?.toLocaleString('en-IN')} is overdue
                </>
              ) : (
                'Urgent consumer recovery deadlines detected.'
              )}
            </p>
          </div>
        </div>

        {/* Right: Actions, Audio Toggle, Desktop Permission, and Dismiss */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 self-start sm:self-center">
          {permission !== 'granted' && (
            <button
              type="button"
              onClick={requestPermission}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Enable native desktop notifications for urgent deadlines"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Desktop Alerts</span>
            </button>
          )}

          <Button
            variant="primary"
            size="small"
            onClick={() => navigate(topUrgentReturn ? '/app/returns' : '/app/refunds')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs py-1.5 px-3 shadow-xs"
          >
            <span>Resolve Now</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>

          {/* Dismiss */}
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1E232D] transition-colors cursor-pointer"
            title="Dismiss for this session"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
