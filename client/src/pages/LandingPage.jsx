import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  BadgePercent,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Check,
  Calendar,
  DollarSign,
  AlertCircle,
  FolderLock,
  ArrowUpRight,
  BellRing,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Dropdown, DropdownItem, DropdownLabel } from '../components/ui/Dropdown';
import { useTheme } from '../context/ThemeContext';

export const LandingPage = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Workflow steps for Interactive Product Showcase
  const workflowSteps = [
    {
      step: '01',
      title: 'Add Purchase Record',
      tag: 'Step 1: Input in 10s',
      desc: 'Enter basic details or snap your invoice. AfterBuy automatically captures merchant, price, delivery date, and policy window.',
      previewItem: {
        name: 'Sony WH-1000XM4 Wireless Headphones',
        merchant: 'Amazon India',
        price: '₹19,990',
        stage: 'Purchase Logged',
        badge: 'Delivered Aug 28',
        detail: '7-Day Return Window • 1-Yr Brand Warranty',
      }
    },
    {
      step: '02',
      title: 'Return Window Sentinel',
      tag: 'Step 2: Proactive Countdown',
      desc: 'Automated 72h, 48h, and 24h countdown reminders. Know the exact moment your return eligibility expires before it is too late.',
      previewItem: {
        name: 'Sony WH-1000XM4 Wireless Headphones',
        merchant: 'Amazon India',
        price: '₹19,990',
        stage: 'Return Window Closing',
        badge: 'Ends Tomorrow (Sep 03)',
        detail: 'Action Required: Request return before midnight',
      }
    },
    {
      step: '03',
      title: 'Doorstep Courier & Refund Tracker',
      tag: 'Step 3: Paisa Wapas',
      desc: 'Return initiated? We monitor the package pickup and hold merchants accountable to their refund turnaround promises.',
      previewItem: {
        name: 'Logitech MX Master 3S Mouse',
        merchant: 'Croma Retail',
        price: '₹7,995',
        stage: 'Refund Overdue',
        badge: '3 Days Past Promised Date',
        detail: 'Courier returned package on Aug 29. Claim template ready.',
      }
    },
    {
      step: '04',
      title: 'Long-term Warranty & Receipt Vault',
      tag: 'Step 4: Year-Round Protection',
      desc: 'Receipts, serial numbers, and warranty certificates stored in one secure digital vault for effortless claims down the road.',
      previewItem: {
        name: 'Apple iPad Air (M2, 128GB)',
        merchant: 'Apple BKC Store',
        price: '₹59,900',
        stage: 'Warranty Active',
        badge: '348 Days Coverage Remaining',
        detail: 'Invoice #AP-99410 safely archived in PDF vault',
      }
    }
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#0F1115] text-slate-900 dark:text-[#F5F7FA] selection:bg-blue-100 selection:text-blue-700">
      
      {/* ========================================================================= */}
      {/* 1. NAVBAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full max-w-full border-b border-slate-200/80 dark:border-[#22262F] bg-white dark:bg-[#11141A]">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center tracking-wider shadow-xs group-hover:bg-blue-700 transition-colors shrink-0">
              AB
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
                AFTERBUY
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-[#747C89] font-medium tracking-tight">
                Everything after you buy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600 dark:text-[#A9B0BC]">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#problem" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">The Problem</a>
            <a href="#benefits" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Benefits</a>
          </nav>

          {/* Action Buttons + Theme Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Theme Switcher */}
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="p-1.5 sm:p-2 rounded-lg text-slate-500 dark:text-[#A9B0BC] hover:text-slate-800 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1C2028] transition-colors cursor-pointer"
                  aria-label="Toggle theme"
                  title={`Current theme: ${theme}`}
                >
                  {resolvedTheme === 'dark' ? (
                    <Moon className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                </button>
              }
            >
              <DropdownLabel>Appearance</DropdownLabel>
              <DropdownItem
                icon={Sun}
                onClick={() => setTheme('light')}
                className={theme === 'light' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}
              >
                <div className="flex items-center justify-between w-full">
                  <span>Light</span>
                  {theme === 'light' && <Check className="w-3.5 h-3.5" />}
                </div>
              </DropdownItem>
              <DropdownItem
                icon={Moon}
                onClick={() => setTheme('dark')}
                className={theme === 'dark' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}
              >
                <div className="flex items-center justify-between w-full">
                  <span>Dark</span>
                  {theme === 'dark' && <Check className="w-3.5 h-3.5" />}
                </div>
              </DropdownItem>
              <DropdownItem
                icon={Laptop}
                onClick={() => setTheme('system')}
                className={theme === 'system' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}
              >
                <div className="flex items-center justify-between w-full">
                  <span>System</span>
                  {theme === 'system' && <Check className="w-3.5 h-3.5" />}
                </div>
              </DropdownItem>
            </Dropdown>

            <Link to="/login" className="hidden sm:inline-block">
              <Button variant="ghost" size="small">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" className="shrink-0">
              <Button variant="primary" size="small" className="shadow-xs text-xs px-3 py-1.5 whitespace-nowrap">
                <span className="hidden sm:inline">Get Started Free</span>
                <span className="sm:hidden">Get Started</span>
              </Button>
            </Link>

            {/* Mobile menu hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-[#22262F] bg-white dark:bg-[#11141A] px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] py-1">Features</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] py-1">How It Works</a>
            <a href="#problem" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] py-1">The Problem</a>
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] py-1">Benefits</a>
            <div className="pt-3 border-t border-slate-100 dark:border-[#22262F] flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] py-1.5 text-center rounded-lg border border-slate-200 dark:border-[#292E38]">
                Sign In
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button variant="primary" size="small" className="w-full text-xs py-2">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-14 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Lightweight Ambient Radial Gradient (No CPU blur) */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 dark:from-blue-600/15 via-transparent to-transparent rounded-full -z-10" />

        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] sm:text-xs font-medium mb-6 max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="font-semibold truncate">The Post-Purchase Management OS</span>
          <span className="hidden sm:inline text-blue-400">•</span>
          <span className="hidden sm:inline text-slate-500 dark:text-[#A9B0BC]">100% Free for Consumers</span>
        </div>

        {/* Core Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-slate-900 dark:text-[#F5F7FA] max-w-4xl mx-auto leading-[1.15] sm:leading-[1.12] break-words">
          Never let a return window expire <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
            or a refund slip away.
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-[#A9B0BC] max-w-2xl mx-auto leading-relaxed">
          Shopping online is effortless. The chaos starts <i>after</i> delivery. AfterBuy tracks return deadlines, overdue merchant refunds, invoices, and warranties—all in one clear dashboard.
        </p>

        {/* Primary CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button variant="primary" size="large" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto px-8 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30">
              Start Tracking Free
            </Button>
          </Link>
          <a href="#preview" className="w-full sm:w-auto">
            <Button variant="outline" size="large" className="w-full sm:w-auto px-6">
              Explore Live Product
            </Button>
          </a>
        </div>

        {/* Trust/Benefit Bullet Points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-[#A9B0BC]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Zero merchant credentials or inbox access required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Works with Amazon, Flipkart, Myntra, Apple & offline stores</span>
          </div>
          <div className="flex items-center gap-1.5 hidden md:flex">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>End-to-end encrypted private document vault</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3 & 4. REAL AFTERBUY PRODUCT PREVIEW (LARGE SAAS DASHBOARD) */}
        {/* ========================================================================= */}
        <div id="preview" className="mt-14 relative mx-auto max-w-5xl text-left scroll-mt-24">
          
          {/* Subtle Ambient Backlight Framing */}
          <div className="absolute inset-0 rounded-2xl bg-blue-500/10 dark:bg-blue-600/10 -z-10" />

          {/* Main Dashboard Preview Container */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-2xl shadow-slate-900/10 dark:shadow-black/70 overflow-hidden">
            
            {/* Top Product Window Header Bar */}
            <div className="px-4 py-3 bg-slate-50/90 dark:bg-[#13161C] border-b border-slate-200/80 dark:border-[#22262F] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-500 dark:text-[#A9B0BC]">
                  app.afterbuy.io/dashboard
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live System • 2 Urgent Items
                </span>
                <Link to="/login" className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline hidden sm:inline">
                  Interactive App
                </Link>
              </div>
            </div>

            {/* Simulated Live AfterBuy Dashboard Workspace */}
            <div className="p-4 sm:p-6 space-y-6 bg-slate-50/40 dark:bg-[#11141A]/50">
              
              {/* Context Greeting Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-[#22262F] pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
                    Good morning, Alex
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A9B0BC]">
                    Here is what requires your attention across your purchases today.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 dark:text-[#747C89]">Demo Session</span>
                  <Link to="/signup">
                    <Button variant="primary" size="small" className="text-xs py-1 px-3">
                      + Add Purchase
                    </Button>
                  </Link>
                </div>
              </div>

              {/* ACTION REQUIRED BANNER (Matches actual DashboardPage) */}
              <div className="rounded-xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/25 p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-200/60 dark:bg-amber-900/50 px-2 py-0.5 rounded">
                          Action Required
                        </span>
                        <span className="text-xs font-semibold text-amber-950 dark:text-amber-100">
                          2 items need your immediate action
                        </span>
                      </div>
                      <p className="text-xs text-amber-900/90 dark:text-amber-200/90 mt-1">
                        <strong>Sony WH-1000XM4</strong> return closes tomorrow • <strong>Logitech MX Master 3S</strong> refund of ₹7,995 is overdue
                      </p>
                    </div>
                  </div>
                  <Link to="/signup" className="shrink-0 self-start sm:self-center">
                    <Button variant="primary" size="small" className="bg-amber-600 hover:bg-amber-700 text-white text-xs py-1 px-2.5">
                      Review Items →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* 4 CORE KPI STAT CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#A9B0BC] text-xs font-medium">
                    <span>Pending Refunds</span>
                    <BadgePercent className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">
                    ₹14,299
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5 font-medium">
                    1 overdue from Croma
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#A9B0BC] text-xs font-medium">
                    <span>Active Return Windows</span>
                    <RotateCcw className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">
                    3 items
                  </div>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5 font-medium">
                    Earliest ends tomorrow
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#A9B0BC] text-xs font-medium">
                    <span>Active Warranties</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">
                    18 items
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
                    1 expiring next month
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#A9B0BC] text-xs font-medium">
                    <span>Total Refunded</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">
                    ₹31,480
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                    100% recovered to bank
                  </p>
                </div>
              </div>

              {/* REAL DASHBOARD TABLE SNAPSHOT: Approaching Return Deadlines */}
              <div className="rounded-xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] overflow-hidden shadow-xs w-full max-w-full">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-[#22262F] flex items-center justify-between bg-slate-50/50 dark:bg-[#13161C]">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] uppercase tracking-wider">
                      Approaching Return Deadlines
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC]">
                      Countdown timers actively running for verified orders
                    </p>
                  </div>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold shrink-0">
                    Live Telemetry
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-[#22262F] text-xs">
                  {/* Row 1: Urgent Return */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#1C2028]/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                        WH
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-[#F5F7FA] flex flex-wrap items-center gap-1.5">
                          <span className="truncate">Sony WH-1000XM4 Wireless Headphones</span>
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">#402-892182</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <span>Amazon India</span>
                          <span>•</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">₹19,990</span>
                          <span>•</span>
                          <span>Delivered Aug 28</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center shrink-0">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/50">
                        Tomorrow
                      </span>
                      <StatusBadge status="return-expiring" size="small" />
                      <Link to="/signup">
                        <Button variant="primary" size="small" className="text-xs py-1 px-2.5">
                          Request Return
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Row 2: Eligible Return */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#1C2028]/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#1C2028] text-slate-700 dark:text-[#F5F7FA] flex items-center justify-center font-bold text-xs shrink-0">
                        NK
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-[#F5F7FA] flex flex-wrap items-center gap-1.5">
                          <span className="truncate">Nike Air Zoom Pegasus 40</span>
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">#MYN-772192</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <span>Myntra</span>
                          <span>•</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">₹6,499</span>
                          <span>•</span>
                          <span>Delivered Aug 31</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center shrink-0">
                      <span className="text-xs font-medium text-slate-600 dark:text-[#A9B0BC]">
                        4 days left
                      </span>
                      <StatusBadge status="return-eligible" size="small" />
                      <Link to="/signup">
                        <Button variant="outline" size="small" className="text-xs py-1 px-2.5">
                          View Order
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Row 3: Overdue Refund Callout */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#1C2028]/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                        MX
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-[#F5F7FA] flex flex-wrap items-center gap-1.5">
                          <span className="truncate">Logitech MX Master 3S Mouse</span>
                          <span className="text-[10px] text-slate-400 font-normal shrink-0">#CRO-18302</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <span>Croma Retail</span>
                          <span>•</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">₹7,995</span>
                          <span>•</span>
                          <span>Item Returned Aug 29</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center shrink-0">
                      <StatusBadge status="refund-overdue" size="small" />
                      <Link to="/signup">
                        <Button variant="danger" size="small" className="text-xs py-1 px-2.5">
                          Flag Overdue
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SOCIAL PROOF / HONEST TRUST SECTION */}
      {/* ========================================================================= */}
      <section className="py-12 border-y border-slate-200/80 dark:border-[#22262F] bg-white/70 dark:bg-[#11141A]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Built for post-checkout reality
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1 leading-relaxed">
                  Track return windows, recover overdue refunds, and keep digital warranty cards ready when hardware fails.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                <FolderLock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Zero commercial data sharing
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1 leading-relaxed">
                  We don't sell your order history to advertisers or scrape your banking passwords. You own 100% of your data.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Instant policy calculations
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1 leading-relaxed">
                  Pre-calibrated logic for 7-day, 10-day, 14-day, and 30-day merchant windows from the exact delivery timestamp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PROBLEM SECTION */}
      {/* ========================================================================= */}
      <section id="problem" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-md border border-rose-200 dark:border-rose-900/50">
            The Post-Purchase Trap
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
            Buying is easy. Managing what happens after isn't.
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
            Every year, ordinary online shoppers lose thousands in overlooked return windows, untracked merchant refunds, and forgotten manufacturer protection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Problem 1 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs hover:border-slate-300 dark:hover:border-[#383E4C] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1 uppercase tracking-wider">01. Window Expires</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
              You miss the deadline
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
              7-day or 10-day store return windows expire quietly. By the time you try on the fit or test the gadget, the return button is disabled.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs hover:border-slate-300 dark:hover:border-[#383E4C] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 uppercase tracking-wider">02. Refund Delayed</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
              Money stays stuck
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
              The delivery agent picked up the returned item, but the merchant never credited your bank account. Nobody tracks whether it actually arrived.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs hover:border-slate-300 dark:hover:border-[#383E4C] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">03. Warranty Forgotten</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
              Coverage goes unused
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
              When an expensive phone, laptop, or appliance acts up 10 months later, you cannot remember if it is still covered by the manufacturer.
            </p>
          </div>

          {/* Problem 4 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs hover:border-slate-300 dark:hover:border-[#383E4C] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wider">04. Lost Invoices</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
              Claims get rejected
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
              Authorized service centers demand the original tax invoice. Digging through thousands of unread promotional emails is a nightmare.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SOLUTION / PRODUCT CAPABILITIES OVERVIEW */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50/60 dark:bg-[#11141A]/50 border-y border-slate-200/80 dark:border-[#22262F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-md border border-blue-200 dark:border-blue-800/50">
              The Comprehensive OS
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
              One place for everything after checkout.
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-[#A9B0BC]">
              AfterBuy consolidates every fragmented post-purchase chore into a high-clarity personal ledger.
            </p>
          </div>

          {/* Solution Asymmetrical Feature Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Block 1: Real-time Return Window Countdown */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-[#292E38] bg-white dark:bg-[#171A21] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-4">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return Window Sentinel</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Never get stuck with an unwanted product.
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                  Automatic timeline calculation calibrated to merchant policies (Amazon 7-day, Myntra 14-day, Apple 14-day). Clear countdown flags warn you before the return eligibility shuts.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-800 dark:text-[#F5F7FA]">Return Eligibility Gauge</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">Ends Tomorrow at 11:59 PM</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#22262F] h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full w-[85%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#747C89] mt-2">
                  <span>Delivered: Aug 28</span>
                  <span>7-Day Standard Window</span>
                </div>
              </div>
            </div>

            {/* Block 2: Overdue Refund Recovery */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-[#292E38] bg-white dark:bg-[#171A21] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-4">
                  <BadgePercent className="w-3.5 h-3.5" />
                  <span>Refund Recovery Engine</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Pinpoint missing money immediately.
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                  When a courier collects a return package, merchants give a 3-5 business day credit estimate. AfterBuy holds them accountable and triggers dispute-ready templates if delayed.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">Logitech MX Master 3S</span>
                  <StatusBadge status="refund-overdue" size="small" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-[#A9B0BC]">Expected Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-[#F5F7FA]">₹7,995</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 font-medium">
                  Notice: 3 days past the promised credit date. Ready for merchant escalation.
                </p>
              </div>
            </div>

            {/* Block 3: Digital Warranty Vault */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-[#292E38] bg-white dark:bg-[#171A21] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Digital Warranty Vault</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Keep every warranty visible for years.
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                  Store hardware serial numbers, coverage expiry dates, and manufacturer support numbers. Get proactive notices 30 days before coverage expires.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">iPad Air (M2, 128GB)</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">Apple 1-Year Limited Warranty</div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200/80 dark:border-emerald-800/50">
                  Active • 348 Days
                </span>
              </div>
            </div>

            {/* Block 4: Instant Document Vault */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-[#292E38] bg-white dark:bg-[#171A21] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Encrypted Receipt Storage</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Find any invoice in 2 seconds.
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                  Attach PDF invoices, scanned paper bills, or image receipts directly to each purchase record. Never search your messy email trash folder again.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white dark:bg-[#1C2028] rounded border border-slate-200 dark:border-[#292E38] text-blue-600 dark:text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">Amazon_Tax_Invoice.pdf</div>
                    <div className="text-[11px] text-slate-400 dark:text-[#747C89]">248 KB • Verified Tax Receipt</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Attached</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FEATURES SECTION (CORE 4 PILLARS) */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-md border border-blue-200 dark:border-blue-800/50">
            Core Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
            Engineered for total post-purchase peace of mind.
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-[#A9B0BC]">
            Everything is built around clarity, speed, and eliminating tedious customer service back-and-forth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1: Return Window Tracking */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700/60 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                Return Window Tracking
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                Know exactly how much time remains before a return window closes. Get warned before you lose eligibility.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#22262F]">
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Policy logic built-in <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Feature 2: Refund Recovery */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700/60 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <BadgePercent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                Refund Recovery
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                Track pending refunds and identify overdue money. Never let a courier pickup get forgotten without credit.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#22262F]">
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                Zero missed paisa <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Feature 3: Warranty Tracking */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                Warranty Tracking
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                Keep warranty coverage visible and know when protection expires. Store claim contact numbers and serial IDs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#22262F]">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                Multi-year visibility <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Feature 4: Document Vault */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700/60 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                Document Vault
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                Keep receipts, tax invoices, and warranty documents organized. One-click access whenever a service center asks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#22262F]">
              <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                Encrypted storage <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. INTERACTIVE PRODUCT SHOWCASE (STEP-BY-STEP WORKFLOW) */}
      {/* ========================================================================= */}
      <section id="workflow" className="py-20 bg-slate-50/70 dark:bg-[#11141A]/60 border-y border-slate-200/80 dark:border-[#22262F] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-md border border-blue-200 dark:border-blue-800/50">
              Interactive Workflow
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
              See how AfterBuy manages a real order.
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-[#A9B0BC]">
              Click through the lifecycle stages below to experience how AfterBuy escorts an item from delivery to warranty protection.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Interactive Stage Selectors */}
            <div className="lg:col-span-5 space-y-3">
              {workflowSteps.map((step, idx) => (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-colors cursor-pointer ${
                    activeWorkflowStep === idx
                      ? 'border-blue-500/80 bg-white dark:bg-[#171A21] shadow-md shadow-blue-500/5 dark:shadow-black/50 ring-1 ring-blue-500/30'
                      : 'border-slate-200/80 dark:border-[#292E38] bg-white/60 dark:bg-[#13161C]/50 hover:bg-white dark:hover:bg-[#171A21]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                      activeWorkflowStep === idx ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-[#747C89]'
                    }`}>
                      {step.tag}
                    </span>
                    <span className={`text-xs font-mono font-bold ${
                      activeWorkflowStep === idx ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                    }`}>
                      {step.step}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1 line-clamp-2">
                    {step.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Right Column: Live Simulated UI Card for Selected Step */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xl shadow-slate-900/5 dark:shadow-black/60">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#22262F]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F5F7FA]">
                      Stage {workflowSteps[activeWorkflowStep].step}: {workflowSteps[activeWorkflowStep].title}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-full">
                    Telemetry Active
                  </span>
                </div>

                {/* Simulated Order Card */}
                <div className="my-6 p-5 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#292E38] space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#747C89]">
                        Tracked Purchase Record
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA] mt-0.5">
                        {workflowSteps[activeWorkflowStep].previewItem.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-[#A9B0BC]">
                        {workflowSteps[activeWorkflowStep].previewItem.merchant} • {workflowSteps[activeWorkflowStep].previewItem.price}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-[#1C2028] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#292E38] shadow-2xs">
                      {workflowSteps[activeWorkflowStep].previewItem.stage}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#171A21] border border-slate-200/80 dark:border-[#22262F] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{workflowSteps[activeWorkflowStep].previewItem.detail}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                      {workflowSteps[activeWorkflowStep].previewItem.badge}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-[#22262F]">
                  <p className="text-xs text-slate-500 dark:text-[#A9B0BC]">
                    {workflowSteps[activeWorkflowStep].desc}
                  </p>
                  <Link to="/signup" className="shrink-0 w-full sm:w-auto">
                    <Button variant="primary" size="small" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                      Test This In App
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. HOW IT WORKS (SIMPLE 3-STEP PROCESS) */}
      {/* ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#A9B0BC]">
            Dead Simple Onboarding
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
            Start tracking in under 30 seconds
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-2">
            No browser extensions, no bank logins, no merchant scraping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#171A21] border border-slate-200/80 dark:border-[#292E38] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center mb-4">
              01
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
              Add your purchase
            </h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
              Enter item name, store, price, and delivery date. Choose a pre-calibrated return window (7, 10, or 14 days) or upload your invoice.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#171A21] border border-slate-200/80 dark:border-[#292E38] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center mb-4">
              02
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
              AfterBuy tracks the dates
            </h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
              Timers countdown automatically. We monitor your return eligibility, reverse pickup statuses, expected refund dates, and warranty milestones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#171A21] border border-slate-200/80 dark:border-[#292E38] shadow-xs">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center mb-4">
              03
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
              Take action & protect value
            </h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
              Initiate a return before time runs out, flag overdue refund delays to customer care, and file warranty claims with receipts already archived.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. BENEFIT / OUTCOME SECTION */}
      {/* ========================================================================= */}
      <section id="benefits" className="py-20 bg-slate-50/60 dark:bg-[#11141A]/50 border-t border-slate-200/80 dark:border-[#22262F] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-md border border-blue-200 dark:border-blue-800/50">
              Clear Outcomes
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
              Why smart shoppers rely on AfterBuy.
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-[#A9B0BC]">
              Direct outcomes that protect your household finances every time you order online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-[#171A21] border border-slate-200/80 dark:border-[#292E38] shadow-xs">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Never miss a return deadline.
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                  Avoid paying full price for clothing that doesn't fit or electronics that arrived defective because you forgot to click return in the 7-day window.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-[#171A21] border border-slate-200/80 dark:border-[#292E38] shadow-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Know where your refunds stand.
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                  Catch every instance where a seller took back an item but delayed crediting your credit card or bank account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-[#171A21] border border-slate-200/80 dark:border-[#292E38] shadow-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Keep every warranty visible.
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                  Never let a 1-year or 2-year manufacturer warranty slip by unutilized when a home device or gadget malfunctions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-[#171A21] border border-slate-200/80 dark:border-[#292E38] shadow-xs">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Find every receipt when you need it.
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#A9B0BC] leading-relaxed">
                  Have authorized tax invoices and purchase proofs ready on your phone during repair service center check-ins.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. FINAL CTA SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 bg-slate-900 dark:bg-[#11141A] text-white text-center border-t border-slate-800 dark:border-[#22262F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/40 text-blue-300 text-xs font-semibold border border-blue-700/50">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Set up your account in 30 seconds</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Take complete control of <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              every order you place.
            </span>
          </h2>

          <p className="mt-4 text-slate-300 dark:text-[#A9B0BC] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of shoppers who protect their money with automated return reminders, refund dispute logs, and centralized warranty receipts.
          </p>

          <div className="pt-4 flex justify-center">
            <Link to="/signup">
              <Button variant="primary" size="large" icon={ArrowRight} iconPosition="right" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 shadow-xl shadow-blue-600/30">
                Claim Your Free Account
              </Button>
            </Link>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-[#747C89]">
            No credit card needed • Free forever for consumers • Instant setup
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-[#22262F] bg-white dark:bg-[#0F1115] pt-12 sm:pt-16 pb-12 text-slate-600 dark:text-[#A9B0BC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            {/* Column 1: Brand & Mission (full width on mobile, 2 cols on tablet/desktop) */}
            <div className="sm:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center tracking-wider shadow-xs">
                  AB
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
                    AFTERBUY
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-[#747C89] font-medium tracking-tight">
                    Post-Purchase Management OS
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#A9B0BC] max-w-sm leading-relaxed">
                The smart post-purchase command center. Track return windows, recover overdue merchant refunds, and store lifetime warranties and invoices in one secure vault.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 w-fit px-2.5 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational • 99.98% Uptime
              </div>
            </div>

            {/* Column 2: PRODUCT */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FA]">PRODUCT</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-[#A9B0BC]">
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#workflow" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Benefits</a></li>
                <li><a href="#problem" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Why AfterBuy</a></li>
              </ul>
            </div>

            {/* Column 3: COMPANY */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FA]">COMPANY</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-[#A9B0BC]">
                <li><Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-slate-700 dark:text-[#F5F7FA]">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-slate-700 dark:text-[#F5F7FA]">Contact</Link></li>
                <li><Link to="/contact" className="hover:text-slate-900 dark:hover:text-[#F5F7FA] transition-colors">Support</Link></li>
              </ul>
            </div>

            {/* Column 4: LEGAL & ACCOUNT */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F5F7FA]">LEGAL & ACCOUNT</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-[#A9B0BC]">
                <li><Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-slate-700 dark:text-[#F5F7FA]">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-slate-700 dark:text-[#F5F7FA]">Terms of Service</Link></li>
                <li><Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-slate-700 dark:text-[#F5F7FA]">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-slate-700 dark:text-[#F5F7FA]">Create Account</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright and Essential Quick Links */}
          <div className="pt-8 border-t border-slate-100 dark:border-[#22262F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-[#747C89]">
            <p>© 2026 AfterBuy Technologies Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 text-slate-400 dark:text-[#A9B0BC] font-medium">
              <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 transition-colors">Contact</Link>
              <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
