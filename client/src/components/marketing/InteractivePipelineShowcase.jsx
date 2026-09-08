import React, { useState, useEffect } from 'react';
import {
  Truck,
  Scan,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  Warehouse,
  Coins
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const InteractivePipelineShowcase = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const stages = [
    {
      id: 0,
      number: '1',
      title: 'Doorstep Delivery',
      subtitle: 'Package unboxed • 7-day clock starts',
      tag: 'Truck arrives',
      icon: Truck,
      status: 'Delivered • Window Active',
      statusColor: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/60',
      telemetry: '09:41 AM • Order #AB-8821 verified • 7-Day return sentinel armed',
      coordinates: { x: '8%', y: '40%' },
      mobileCoords: { x: '10%', y: '10%' },
      metric: '7 Days Left',
      desc: 'AfterBuy captures the exact delivery timestamp and starts an automated countdown synced to the merchant\'s return policy.'
    },
    {
      id: 1,
      number: '2',
      title: 'Return Sentinel',
      subtitle: 'Auto-scan policy & 48h deadline alert',
      tag: 'Policy scan',
      icon: Scan,
      status: 'Proactive Alert',
      statusColor: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/60',
      telemetry: '14:20 PM • Window alert triggered • 1-click return requested',
      coordinates: { x: '27%', y: '16%' },
      mobileCoords: { x: '10%', y: '30%' },
      metric: '48h Reminder',
      desc: 'Proactive alerts warn you before the return eligibility shuts. Request a return with 1 tap before it is too late.'
    },
    {
      id: 2,
      number: '3',
      title: 'Doorstep Pickup',
      subtitle: 'Courier collects & reverse AWB logged',
      tag: 'Reverse transit',
      icon: PackageCheck,
      status: 'Pickup Completed',
      statusColor: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-900/60',
      telemetry: '16:05 PM • BlueDart agent scanned AWB #BD-99104 • In reverse transit',
      coordinates: { x: '47%', y: '44%' },
      mobileCoords: { x: '10%', y: '50%' },
      metric: 'In Reverse Transit',
      desc: 'The pickup agent scans the item. AfterBuy securely stores the courier tracking receipt and logs expected refund turnaround.'
    },
    {
      id: 3,
      number: '4',
      title: 'Merchant Hub Scan',
      subtitle: 'Warehouse diagnostic & RMA match',
      tag: 'Inspection pass',
      icon: Warehouse,
      status: 'Hub Inbound Verified',
      statusColor: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900/60',
      telemetry: '18:30 PM • Package arrived at Amazon Hub • RMA matched • Refund approved',
      coordinates: { x: '67%', y: '64%' },
      mobileCoords: { x: '10%', y: '70%' },
      metric: 'RMA Matched',
      desc: 'The package arrives at the merchant\'s logistics center. Verification is passed, and merchant initiates the bank refund wire.'
    },
    {
      id: 4,
      number: '5',
      title: '100% Refund in Bank',
      subtitle: '₹19,990 credited • Money recovered',
      tag: 'Settled to account',
      icon: CheckCircle2,
      status: 'Refund Settled',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
      telemetry: 'Next Day 10:15 AM • IMPS Ref #991024 credited to HDFC Bank • ₹19,990 Recovered',
      coordinates: { x: '86%', y: '36%' },
      mobileCoords: { x: '10%', y: '90%' },
      metric: '₹19,990 Recovered',
      desc: 'The money hits your bank account. AfterBuy confirms the settlement so no refund ever goes missing unnoticed.'
    }
  ];

  // Auto-play stepper every 3.8 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stages.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPlaying, stages.length]);

  const current = stages[activeStep];

  return (
    <section id="workflow" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-900/60 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Interactive Post-Purchase Sentinel</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
          Watch what happens to your order and refund in real-time.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
          From the moment a package arrives at your door to the second your refund hits your bank account—AfterBuy tracks every milestone so zero money is lost.
        </p>
      </div>

      {/* Main Interactive Board Container */}
      <div className="relative rounded-2xl border border-slate-200/90 dark:border-[#292E38] bg-white dark:bg-[#11141A] shadow-xl shadow-slate-900/5 dark:shadow-black/60 overflow-hidden">
        
        {/* Top Board Bar */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-[#13161C] border-b border-slate-200/80 dark:border-[#22262F] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-[11px] shadow-xs">
              AB
            </div>
            <span className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
              Hub Sentinel 01
            </span>
            <span className="text-slate-300 dark:text-[#292E38]">•</span>
            <span className="text-[11px] text-slate-500 dark:text-[#A9B0BC] hidden sm:inline">
              Live Resolution Pathway
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
              <span>Tracking 1 Order • SKU B07XJ8C8F5</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CANVAS WORKSPACE (DESKTOP & TABLET PIPELINE VIEW) */}
        {/* ========================================================================= */}
        <div className="relative w-full h-[460px] sm:h-[480px] lg:h-[500px] overflow-hidden select-none bg-[#FBFDFF] dark:bg-[#0E1117]">
          
          {/* Subtle Blueprint Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Ambient Blueprint Guide Lines */}
          <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-200/60 dark:border-[#1E232E] pointer-events-none" />
          <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-200/60 dark:border-[#1E232E] pointer-events-none" />
          <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-200/60 dark:border-[#1E232E] pointer-events-none" />

          {/* SVG Pipelined Connecting Track */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#0284C7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
              </linearGradient>
              <pattern id="conveyorTicks" width="14" height="14" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="14" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.4" />
              </pattern>
            </defs>

            {/* Stepped Circuit Pipeline Route */}
            <path
              d="M 120 220 
                 L 220 220 
                 L 220 130 
                 L 380 130 
                 L 380 240 
                 L 580 240 
                 L 580 340 
                 L 800 340 
                 L 800 210 
                 L 980 210"
              fill="none"
              stroke="#BAE6FD"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dark:stroke-sky-950/60"
            />
            
            {/* Ticks inside the track */}
            <path
              d="M 120 220 
                 L 220 220 
                 L 220 130 
                 L 380 130 
                 L 380 240 
                 L 580 240 
                 L 580 340 
                 L 800 340 
                 L 800 210 
                 L 980 210"
              fill="none"
              stroke="#0284C7"
              strokeWidth="14"
              strokeDasharray="4 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-60 dark:opacity-80"
            />

            {/* Active Glow Pulse Path */}
            <path
              d="M 120 220 
                 L 220 220 
                 L 220 130 
                 L 380 130 
                 L 380 240 
                 L 580 240 
                 L 580 340 
                 L 800 340 
                 L 800 210 
                 L 980 210"
              fill="none"
              stroke="url(#pipeGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* 5 CHECKPOINT STATIONS (Exact aesthetic from reference) */}
          <div className="relative w-full h-full">
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
                  style={{
                    left: stage.coordinates.x,
                    top: stage.coordinates.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={cn(
                    "absolute z-10 w-48 sm:w-56 p-3 sm:p-3.5 rounded-xl border bg-white/95 dark:bg-[#151921]/95 backdrop-blur-sm cursor-pointer transition-all duration-300 select-none",
                    isActive
                      ? "border-l-[5px] border-l-blue-600 dark:border-l-blue-400 border-slate-300 dark:border-[#383F4D] shadow-xl shadow-blue-600/15 scale-105 ring-2 ring-blue-500/20"
                      : isPassed
                      ? "border-l-[4px] border-l-emerald-500 border-slate-200 dark:border-[#22262F] opacity-90 hover:opacity-100 hover:border-slate-300"
                      : "border-slate-200/80 dark:border-[#22262F] opacity-60 hover:opacity-90"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-slate-900 dark:text-[#F5F7FA] tracking-tight truncate">
                        {stage.number}. {stage.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] truncate mt-0.5">
                        {stage.subtitle}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-lg text-xs shrink-0 transition-colors",
                        isActive
                          ? "bg-blue-600 text-white shadow-xs"
                          : isPassed
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-400 dark:bg-[#1F242E] dark:text-[#747C89]"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Active Indicator & Metric Badge */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-[#22262F] flex items-center justify-between text-[10px]">
                    <span className={cn("font-semibold px-2 py-0.5 rounded-full border", stage.statusColor)}>
                      {stage.tag}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* ANIMATED MOVING PARCEL (📦) */}
            <div
              style={{
                left: current.coordinates.x,
                top: current.coordinates.y,
                transform: 'translate(-50%, -155%)',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              className="absolute z-20 pointer-events-none flex flex-col items-center"
            >
              {/* 3D Parcel Box Badge */}
              <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-amber-950 shadow-lg shadow-amber-500/30 border-2 border-white dark:border-slate-800 animate-bounce">
                <span className="text-xl">📦</span>
              </div>
              <div className="w-2.5 h-1 rounded-full bg-slate-900/30 dark:bg-black/50 blur-[1px] mt-0.5" />
            </div>

            {/* Bottom Forklift/Truck Decoration (Just like screenshot) */}
            <div className="absolute right-8 bottom-12 hidden lg:flex items-center gap-2 opacity-80 pointer-events-none">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#171A21] border border-slate-200 dark:border-[#22262F] text-[11px] text-slate-500 dark:text-[#A9B0BC]">
                <Truck className="w-3.5 h-3.5 text-blue-500" />
                <span>Automated Reverse Hub</span>
              </div>
            </div>

            {/* Live Telemetry Status Bar (Bottom left of canvas) */}
            <div className="absolute left-6 bottom-4 flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#A9B0BC]">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-mono">{current.telemetry}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM INTERACTIVE 5-STEP CONTROLLER TABS */}
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
                  "p-3.5 sm:p-4 text-left transition-all duration-150 cursor-pointer group flex flex-col justify-between",
                  isActive
                    ? "bg-white dark:bg-[#171A21] shadow-inner"
                    : "hover:bg-slate-100/70 dark:hover:bg-[#181C24]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg transition-colors shrink-0",
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-200/80 dark:bg-[#1F242E] text-slate-500 dark:text-[#A9B0BC] group-hover:text-slate-800 dark:group-hover:text-[#F5F7FA]"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "text-xs font-bold truncate",
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-800 dark:text-[#F5F7FA]"
                      )}
                    >
                      {stage.number}. {stage.title}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-[#747C89] truncate">
                      {stage.tag}
                    </div>
                  </div>
                </div>

                {/* Bottom Active Pill Indicator */}
                <div className="mt-2.5 w-full bg-slate-200/70 dark:bg-[#22262F] h-1 rounded-full overflow-hidden">
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

        {/* Detailed Explanation Drawer for Active Step */}
        <div className="px-5 py-3.5 bg-blue-50/50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-[#F5F7FA]">
            <span className="font-bold text-blue-600 dark:text-blue-400">Step {current.number}:</span>
            <span className="text-slate-600 dark:text-[#A9B0BC]">{current.desc}</span>
          </div>

          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
            <span>Stage Metric: {current.metric}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>
    </section>
  );
};
