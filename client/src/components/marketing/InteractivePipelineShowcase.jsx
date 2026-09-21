import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Bell,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  ArrowRight,
  Shield,
  Layers,
  Calendar,
  Banknote,
  Check
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const InteractivePipelineShowcase = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stages = [
    {
      id: 0,
      number: '1',
      title: 'Ingestion & Policy Sync',
      subtitle: 'Bill stored • Return window auto-calibrated',
      tag: 'Order Ingested',
      icon: FileText,
      status: 'Window Active',
      statusColor: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/60',
      telemetry: '09:41 AM • Order added • Merchant 7-Day return policy calibrated from delivery timestamp',
      systemAction: 'AfterBuy captures the purchase, parses the merchant\'s return policy (7, 10, 14, or 30 days), and securely saves the digital invoice in your vault.',
      linkedFeature: 'Connected to Purchases & Document Vault',
      linkedRoute: '/app/purchases',
      metric: '7-Day Window Calibrated'
    },
    {
      id: 1,
      number: '2',
      title: 'Live Return Sentinel',
      subtitle: '24/7 background countdown • Zero manual tracking',
      tag: 'Monitoring',
      icon: Clock,
      status: 'Live Countdown',
      statusColor: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/50 border-sky-200 dark:border-sky-900/60',
      telemetry: 'Day 3 • Live timer running • 4 Days remaining before return eligibility shuts',
      systemAction: 'No need to set calendar reminders or calculate dates in your head. AfterBuy runs a real-time countdown timer tracking the exact remaining hours.',
      linkedFeature: 'Active Dashboard Sentinel',
      linkedRoute: '/app/dashboard',
      metric: 'Countdown: 4 Days Left'
    },
    {
      id: 2,
      number: '3',
      title: 'Proactive 48h Alert',
      subtitle: 'Smart warning before return eligibility closes',
      tag: 'Urgent Action',
      icon: Bell,
      status: 'Early Warning',
      statusColor: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/60',
      telemetry: 'Day 5 14:20 PM • 48h Warning sent • Prompt: Keep item or initiate return with merchant?',
      systemAction: 'Before the merchant\'s return door shuts forever, AfterBuy alerts you so you can initiate a return or replacement before your hard-earned money gets trapped.',
      linkedFeature: 'Urgent Attention System',
      linkedRoute: '/app/returns',
      metric: '48h Early Notification'
    },
    {
      id: 3,
      number: '4',
      title: 'Refund Reconciliation',
      subtitle: 'Courier pickup logged • Bank credit verified',
      tag: 'Bank Settlement',
      icon: RotateCcw,
      status: 'In Settlement',
      statusColor: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/60',
      telemetry: 'Day 7 16:30 PM • Courier pickup confirmed • Merchant approved • Refund tracked to bank',
      systemAction: 'If you choose to return, AfterBuy logs the courier tracking receipt and tracks the expected refund amount until the money actually hits your bank account.',
      linkedFeature: 'Connected to Refund Tracker',
      linkedRoute: '/app/refunds',
      metric: '100% Refund Reconciled'
    },
    {
      id: 4,
      number: '5',
      title: 'Warranty & Bill Vault',
      subtitle: '1 to 3 Year coverage • 1-Click invoice retrieval',
      tag: 'Permanent Protection',
      icon: ShieldCheck,
      status: 'Warranty Active',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
      telemetry: 'Return closed • Item kept • 1-Year manufacturer warranty activated • Invoice permanently preserved',
      systemAction: 'Once the return window closes and you keep the item, AfterBuy seamlessly transitions to long-term warranty tracking with your original invoice always 1 click away for service claims.',
      linkedFeature: 'Connected to Warranty & Document Vault',
      linkedRoute: '/app/warranties',
      metric: '1-Year Warranty Protected'
    }
  ];

  // Auto-play stepper every 4 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, stages.length]);

  const current = stages[activeStep];

  return (
    <section id="workflow" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-900/60 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Automated Protection Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
          How AfterBuy Protects Every Purchase You Make.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
          From the second you add an invoice to the moment your warranty expires or your refund hits your bank—here is the automated step-by-step process running inside AfterBuy.
        </p>
      </div>

      {/* Main Interactive Board Container */}
      <div className="relative rounded-2xl border border-slate-200/90 dark:border-[#292E38] bg-white dark:bg-[#11141A] shadow-xl shadow-slate-900/5 dark:shadow-black/60 overflow-hidden">
        
        {/* Top Board Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-[#13161C] border-b border-slate-200/80 dark:border-[#22262F] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-[11px] shadow-xs">
              AB
            </div>
            <span className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
              AfterBuy Process Engine
            </span>
            <span className="text-slate-300 dark:text-[#292E38]">•</span>
            <span className="text-[11px] text-slate-500 dark:text-[#A9B0BC] hidden sm:inline">
              Live System Lifecycle Simulation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] text-slate-600 dark:text-[#A9B0BC] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-50 dark:hover:bg-[#1C2028] transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-blue-600" /> : <Play className="w-3 h-3 text-blue-600" />}
              <span>{isPlaying ? 'Pause Auto' : 'Auto Play'}</span>
            </button>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Automated Protection Active</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE WORKFLOW CANVAS */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 lg:p-8 bg-[#FBFDFF] dark:bg-[#0E1117] relative">
          
          {/* Subtle Grid Pattern Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* 5-STAGE PROGRESSION CARDS (Responsive Grid with clean spacing, no clipping) */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6">
            {stages.map((stage, idx) => {
              const isActive = activeStep === idx;
              const isPassed = activeStep > idx;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.id}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false);
                  }}
                  className={cn(
                    "relative p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between",
                    isActive
                      ? "bg-white dark:bg-[#151921] border-blue-500/80 dark:border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20 scale-[1.02]"
                      : isPassed
                      ? "bg-white/80 dark:bg-[#13161C]/80 border-slate-200 dark:border-[#22262F] hover:border-slate-300 dark:hover:border-[#2E3542]"
                      : "bg-white/50 dark:bg-[#11141A]/50 border-slate-200/60 dark:border-[#1E232C] opacity-70 hover:opacity-100"
                  )}
                >
                  {/* Step Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                          isActive
                            ? "bg-blue-600 text-white"
                            : isPassed
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-500 dark:bg-[#1F242E] dark:text-[#A9B0BC]"
                        )}
                      >
                        {isPassed ? <Check className="w-3.5 h-3.5" /> : stage.number}
                      </span>

                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                            : "bg-slate-50 text-slate-400 dark:bg-[#171A21] dark:text-[#747C89]"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
                      {stage.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-1 leading-snug">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Stage Tag & Active Marker */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#22262F] flex items-center justify-between">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", stage.statusColor)}>
                      {stage.tag}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* LIVE SYSTEM TELEMETRY TERMINAL (ACTIVE STAGE MONITOR) */}
          {/* ========================================================================= */}
          <div className="relative z-10 rounded-xl border border-blue-100 dark:border-[#22262F] bg-white/95 dark:bg-[#13161C]/95 p-4 sm:p-5 backdrop-blur-sm shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Left Details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold border border-blue-200/80 dark:border-blue-900/50">
                    Stage {current.number} of 5
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">
                    {current.title}
                  </span>
                  <span className="text-slate-300 dark:text-[#292E38]">•</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {current.linkedFeature}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A9B0BC] leading-relaxed max-w-4xl">
                  {current.systemAction}
                </p>

                {/* Simulated Telemetry Log */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-[#747C89] pt-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-mono truncate">{current.telemetry}</span>
                </div>
              </div>

              {/* Right Metric Pill & Next Step Button */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#181C24] border border-slate-200/80 dark:border-[#292E38] text-right">
                  <div className="text-[10px] text-slate-400 dark:text-[#747C89]">Stage Output</div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                    {current.metric}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStep((prev) => (prev + 1) % stages.length);
                    setIsPlaying(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM CONTROLLER STEPPER BAR */}
        {/* ========================================================================= */}
        <div className="border-t border-slate-200/80 dark:border-[#22262F] bg-slate-50/70 dark:bg-[#13161C] grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-[#22262F]">
          {stages.map((stage, idx) => {
            const isActive = activeStep === idx;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                }}
                className={cn(
                  "p-3 sm:p-3.5 text-left transition-all duration-150 cursor-pointer group flex flex-col justify-between",
                  isActive
                    ? "bg-white dark:bg-[#171A21] shadow-inner"
                    : "hover:bg-slate-100/70 dark:hover:bg-[#181C24]"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md transition-colors shrink-0",
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-200/80 dark:bg-[#1F242E] text-slate-500 dark:text-[#A9B0BC]"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "text-[11px] font-bold truncate",
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-[#F5F7FA]"
                      )}
                    >
                      {stage.number}. {stage.title}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-[#747C89] truncate">
                      {stage.tag}
                    </div>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="mt-2 w-full bg-slate-200/70 dark:bg-[#22262F] h-1 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      isActive ? "bg-blue-600 w-full" : "w-0"
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
