import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  X,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Search
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from '../components/ui/Dropdown';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { usePurchases } from '../context/PurchaseContext';
import { useToast } from '../components/ui/Toast';
import { InteractivePipelineShowcase } from '../components/marketing/InteractivePipelineShowcase';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAuthenticated, user, firstName, initials, logout } = useAuth();
  const {
    purchases = [],
    approachingReturnItems = [],
    urgentReturns = [],
    overdueRefunds = [],
    urgentCount = 0,
    totalActiveWarranties = 0,
    totalPendingRefundAmount = 0,
    totalRefundedAmount = 0,
  } = usePurchases();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardFilter, setDashboardFilter] = useState('all');

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

            {isAuthenticated ? (
              /* Circular Avatar Only (Clean, modern with subtle gradient & ring) */
              <Dropdown
                align="right"
                trigger={
                  <button
                    type="button"
                    className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs select-none ring-2 ring-blue-500/25 hover:ring-blue-500/60 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                    aria-label="User account"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </button>
                }
              >
                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-[#22262F]">
                  <div className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA] truncate">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-[#747C89] truncate mt-0.5">
                    {user?.email || 'user@example.com'}
                  </div>
                </div>
                <DropdownItem icon={LayoutDashboard} onClick={() => navigate('/app/dashboard')}>
                  Go to Dashboard
                </DropdownItem>
                <DropdownItem icon={Settings} onClick={() => navigate('/app/settings')}>
                  Settings
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  icon={LogOut}
                  danger
                  onClick={() => {
                    logout();
                    addToast({
                      title: 'Logged Out',
                      message: 'You have been logged out successfully.',
                      type: 'info',
                    });
                  }}
                >
                  Log out
                </DropdownItem>
              </Dropdown>
            ) : (
              <>
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
              </>
            )}

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
            {isAuthenticated ? (
              <div className="pt-3 border-t border-slate-100 dark:border-[#22262F] space-y-2.5">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#171A21] border border-slate-100 dark:border-[#22262F]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs shrink-0 ring-2 ring-blue-500/20">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA] truncate">
                      {user?.name || 'User'}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-[#747C89] truncate">
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                </div>
                <Link to="/app/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full block">
                  <Button variant="primary" size="small" className="w-full text-xs py-2">
                    Open Dashboard →
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    addToast({
                      title: 'Logged Out',
                      message: 'You have been logged out successfully.',
                      type: 'info',
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
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
            )}
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
          
          {/* Subtle Ambient Backlight Glow Framing */}
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-emerald-500/15 blur-xl opacity-70 dark:opacity-40 -z-10" />

          {/* Main Dashboard Preview Window */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0D1017]/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/80 overflow-hidden">
            
            {/* Modern macOS / Web App Window Chrome Header */}
            <div className="px-4 sm:px-5 py-3 bg-slate-50/90 dark:bg-[#11141A] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Window Traffic Lights */}
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-xs" />
                </div>

                {/* Central URL & Command Palette Bar */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100/90 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-slate-500 dark:text-[#A9B0BC] text-xs font-mono">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span>app.afterbuy.io/dashboard</span>
                  <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-400 font-sans">⌘K</span>
                </div>
              </div>

              {/* Right Status Badge */}
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live System • 2 Urgent Items</span>
                </span>
                <Link to="/login" className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline hidden md:inline">
                  Interactive App
                </Link>
              </div>
            </div>

            {/* Simulated Live AfterBuy Dashboard Workspace */}
            <div className="p-4 sm:p-6 space-y-5 bg-[#F8FAFC]/50 dark:bg-[#0E1117]/60">
              
              {/* Context Greeting Bar with User Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs ring-2 ring-blue-500/20 shrink-0">
                    {isAuthenticated ? (
                      user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        initials
                      )
                    ) : (
                      'AB'
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
                        {isAuthenticated ? `Welcome back, ${firstName || 'User'}` : 'Interactive Dashboard Simulator'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isAuthenticated
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-900/50'
                      }`}>
                        {isAuthenticated ? `${purchases.length} Purchases in Cloud • Live Sync` : 'Demo Session • Active Mode'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5">
                      {isAuthenticated
                        ? `${urgentCount} items need attention • ₹${totalPendingRefundAmount.toLocaleString('en-IN')} pending recovery`
                        : 'Previewing how AfterBuy automatically tracks return windows, alerts deadlines, and recovers refunds.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {isAuthenticated ? (
                    <>
                      <Link to="/app/purchases/new">
                        <Button variant="primary" size="small" className="text-xs py-1.5 px-3.5 shadow-sm">
                          + Add Purchase
                        </Button>
                      </Link>
                      <Link to="/app/dashboard">
                        <Button variant="outline" size="small" className="text-xs py-1.5 px-3.5">
                          Open App →
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] text-slate-400 dark:text-[#747C89] hidden sm:inline">Interactive Preview</span>
                      <Link to="/signup">
                        <Button variant="primary" size="small" className="text-xs py-1.5 px-3.5 shadow-sm">
                          Get Started Free →
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* ACTION REQUIRED INTELLIGENCE BANNER */}
              {isAuthenticated ? (
                urgentCount > 0 ? (
                  <div className="rounded-xl border border-amber-300/80 dark:border-amber-500/30 bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-transparent dark:from-amber-950/30 dark:via-amber-950/15 dark:to-transparent p-4 shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5 ring-1 ring-amber-400/30">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-200/70 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                              Action Required
                            </span>
                            <span className="text-xs font-bold text-amber-950 dark:text-amber-100">
                              {urgentCount} {urgentCount === 1 ? 'item needs' : 'items need'} your immediate attention
                            </span>
                          </div>
                          <div className="text-xs text-amber-900/90 dark:text-amber-200/90 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                            {urgentReturns.slice(0, 2).map((item, idx) => (
                              <span key={item.id} className="inline-flex items-center gap-1.5 bg-white/70 dark:bg-black/30 px-2 py-0.5 rounded border border-amber-300/60 dark:border-amber-700/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                <strong>{item.name}</strong> — deadline {item.deadlineText?.toLowerCase() || 'approaching'}
                              </span>
                            ))}
                            {overdueRefunds.slice(0, 1).map((ref) => (
                              <span key={ref.id} className="inline-flex items-center gap-1.5 bg-white/70 dark:bg-black/30 px-2 py-0.5 rounded border border-amber-300/60 dark:border-amber-700/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <strong>{ref.name}</strong> — refund overdue
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Link to="/app/returns" className="shrink-0 self-start md:self-center">
                        <Button variant="primary" size="small" className="bg-amber-600 hover:bg-amber-700 text-white text-xs py-1.5 px-3 whitespace-nowrap shadow-xs">
                          Review {urgentCount} Items →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-300/80 dark:border-emerald-500/30 bg-gradient-to-r from-emerald-50/90 via-emerald-50/30 to-transparent dark:from-emerald-950/30 dark:via-emerald-950/15 dark:to-transparent p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                          All Purchases Protected & On Track
                        </div>
                        <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                          Zero return deadlines expiring in the next 48 hours. All active warranties and refunds are monitored.
                        </p>
                      </div>
                    </div>
                    <Link to="/app/purchases" className="shrink-0">
                      <Button variant="outline" size="small" className="text-xs py-1 px-3">
                        View All Purchases →
                      </Button>
                    </Link>
                  </div>
                )
              ) : (
                /* Guest Simulator Mode */
                <div className="rounded-xl border border-amber-300/80 dark:border-amber-500/30 bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-transparent dark:from-amber-950/30 dark:via-amber-950/15 dark:to-transparent p-4 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5 ring-1 ring-amber-400/30">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-200/70 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                            High Priority Alert
                          </span>
                          <span className="text-xs font-bold text-amber-950 dark:text-amber-100">
                            2 items require your attention today
                          </span>
                        </div>
                        <div className="text-xs text-amber-900/90 dark:text-amber-200/90 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="inline-flex items-center gap-1.5 bg-white/70 dark:bg-black/30 px-2 py-0.5 rounded border border-amber-300/60 dark:border-amber-700/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                            <strong>Sony WH-1000XM4</strong> return window closes tomorrow
                          </span>
                          <span className="text-amber-400 hidden sm:inline">•</span>
                          <span className="inline-flex items-center gap-1.5 bg-white/70 dark:bg-black/30 px-2 py-0.5 rounded border border-amber-300/60 dark:border-amber-700/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <strong>Logitech MX Master 3S</strong> refund of ₹7,995 is overdue
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Link to="/signup" className="shrink-0 self-start md:self-center">
                      <Button variant="primary" size="small" className="bg-amber-600 hover:bg-amber-700 text-white text-xs py-1.5 px-3 whitespace-nowrap shadow-xs">
                        Try Live System →
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* 4 CORE KPI STAT CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* Card 1: Pending Refunds */}
                <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#141820] p-4 shadow-xs hover:border-amber-400/40 transition-all">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#A9B0BC] text-xs font-medium">
                    <span>Pending Refunds</span>
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                      <BadgePercent className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] mt-2">
                    {isAuthenticated ? `₹${totalPendingRefundAmount.toLocaleString('en-IN')}` : '₹14,299'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold truncate">
                      {isAuthenticated
                        ? (overdueRefunds.length > 0 ? `${overdueRefunds.length} overdue` : 'All refunds tracked')
                        : '1 overdue from Croma'}
                    </p>
                  </div>
                </div>

                {/* Card 2: Active Return Windows */}
                <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#141820] p-4 shadow-xs hover:border-blue-400/40 transition-all">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#A9B0BC] text-xs font-medium">
                    <span>Active Return Windows</span>
                    <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] mt-2">
                    {isAuthenticated ? `${approachingReturnItems.length} items` : '3 items'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold truncate">
                      {isAuthenticated
                        ? (urgentReturns.length > 0 ? 'Deadline approaching' : 'Active monitoring')
                        : 'Earliest ends tomorrow'}
                    </p>
                  </div>
                </div>

                {/* Card 3: Active Warranties */}
                <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#141820] p-4 shadow-xs hover:border-emerald-400/40 transition-all">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#A9B0BC] text-xs font-medium">
                    <span>Active Warranties</span>
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] mt-2">
                    {isAuthenticated ? `${totalActiveWarranties} items` : '18 items'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC] truncate">
                      {isAuthenticated ? 'In document vault' : '1 expiring next month'}
                    </p>
                  </div>
                </div>

                {/* Card 4: Total Refunded */}
                <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#141820] p-4 shadow-xs hover:border-cyan-400/40 transition-all">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#A9B0BC] text-xs font-medium">
                    <span>Total Refunded</span>
                    <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] mt-2">
                    {isAuthenticated ? `₹${totalRefundedAmount.toLocaleString('en-IN')}` : '₹31,480'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                      100% recovered to bank
                    </p>
                  </div>
                </div>

              </div>

              {/* REAL DASHBOARD TABLE SNAPSHOT: Approaching Return Deadlines */}
              <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#141820] overflow-hidden shadow-xs w-full max-w-full">
                
                {/* Table Header with Interactive Filter Tabs */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#11141A]">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] uppercase tracking-wider">
                      {isAuthenticated ? 'Your Active Orders' : 'Approaching Return Deadlines'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC]">
                      {isAuthenticated
                        ? 'Real-time monitoring directly from your MongoDB account'
                        : 'Real-time countdown sentinels actively running for verified purchases'}
                    </p>
                  </div>

                  {!isAuthenticated ? (
                    /* Filter Pills for Guest */
                    <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-white/5 p-0.5 rounded-lg text-[11px] shrink-0">
                      <button
                        type="button"
                        onClick={() => setDashboardFilter('all')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          dashboardFilter === 'all'
                            ? 'bg-white dark:bg-[#1E232E] text-slate-900 dark:text-[#F5F7FA] shadow-xs font-bold'
                            : 'text-slate-500 dark:text-[#A9B0BC] hover:text-slate-900'
                        }`}
                      >
                        All (3)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDashboardFilter('urgent')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          dashboardFilter === 'urgent'
                            ? 'bg-white dark:bg-[#1E232E] text-rose-600 dark:text-rose-400 shadow-xs font-bold'
                            : 'text-slate-500 dark:text-[#A9B0BC] hover:text-slate-900'
                        }`}
                      >
                        Urgent (2)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDashboardFilter('refunds')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          dashboardFilter === 'refunds'
                            ? 'bg-white dark:bg-[#1E232E] text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                            : 'text-slate-500 dark:text-[#A9B0BC] hover:text-slate-900'
                        }`}
                      >
                        Refunds (1)
                      </button>
                    </div>
                  ) : (
                    <Link to="/app/purchases" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline shrink-0">
                      View All in App →
                    </Link>
                  )}
                </div>

                {/* Table Rows: Logged-in Real Data vs Guest Simulator */}
                <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                  
                  {isAuthenticated ? (
                    purchases.length > 0 ? (
                      purchases.slice(0, 3).map((item) => (
                        <div key={item.id} className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                              {item.name ? item.name.slice(0, 2).toUpperCase() : 'OR'}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-[#F5F7FA] flex flex-wrap items-center gap-2">
                                <span className="truncate">{item.name}</span>
                                {item.orderNumber && (
                                  <span className="text-[10px] text-slate-400 font-mono font-normal">#{item.orderNumber}</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.retailer || 'Store'}</span>
                                <span>•</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                  ₹{item.price ? Number(item.price).toLocaleString('en-IN') : '0'}
                                </span>
                                {item.deliveryDate && (
                                  <>
                                    <span>•</span>
                                    <span>Delivered {new Date(item.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 self-start md:self-center shrink-0">
                            <StatusBadge status={item.status || 'return-eligible'} size="small" />
                            <Link to={`/app/purchases/${item.id}`}>
                              <Button variant="outline" size="small" className="text-xs py-1.5 px-3">
                                View Order
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">No Purchases Logged Yet</h5>
                          <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5 max-w-sm mx-auto">
                            Add your first purchase to start automated return window countdowns and warranty tracking.
                          </p>
                        </div>
                        <Link to="/app/purchases/new">
                          <Button variant="primary" size="small" className="text-xs py-1.5 px-4 shadow-sm">
                            + Log First Purchase
                          </Button>
                        </Link>
                      </div>
                    )
                  ) : (
                    /* Guest Mode Rows with Interactive Filter */
                    <>
                      {/* Row 1: Sony Headphones (Urgent Return) */}
                      {(dashboardFilter === 'all' || dashboardFilter === 'urgent') && (
                        <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#FF9900]/10 border border-[#FF9900]/30 text-[#D97706] dark:text-[#F59E0B] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                              AZ
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-[#F5F7FA] flex flex-wrap items-center gap-2">
                                <span className="truncate">Sony WH-1000XM4 Wireless Headphones</span>
                                <span className="text-[10px] text-slate-400 font-mono font-normal">#402-892182</span>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Amazon India</span>
                                <span>•</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">₹19,990</span>
                                <span>•</span>
                                <span>Delivered Aug 28 (7-Day Policy)</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 self-start md:self-center shrink-0">
                            <div className="hidden lg:flex flex-col items-end gap-1">
                              <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                6 of 7 Days Passed
                              </div>
                              <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500 rounded-full w-[85%]" />
                              </div>
                            </div>

                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-900/60 shadow-xs">
                              Tomorrow (18h left)
                            </span>

                            <StatusBadge status="return-expiring" size="small" />

                            <Link to="/signup">
                              <Button variant="primary" size="small" className="text-xs py-1.5 px-3">
                                Request Return
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Row 2: Nike Pegasus (Active Return Window) */}
                      {(dashboardFilter === 'all') && (
                        <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#FF3F6C]/10 border border-[#FF3F6C]/30 text-[#FF3F6C] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                              MY
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-[#F5F7FA] flex flex-wrap items-center gap-2">
                                <span className="truncate">Nike Air Zoom Pegasus 40 Running Shoes</span>
                                <span className="text-[10px] text-slate-400 font-mono font-normal">#MYN-772192</span>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Myntra Fashion</span>
                                <span>•</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">₹6,499</span>
                                <span>•</span>
                                <span>Delivered Aug 31 (14-Day Policy)</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 self-start md:self-center shrink-0">
                            <div className="hidden lg:flex flex-col items-end gap-1">
                              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                                3 of 14 Days Passed
                              </div>
                              <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full w-[25%]" />
                              </div>
                            </div>

                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900/60">
                              4 days left
                            </span>

                            <StatusBadge status="return-eligible" size="small" />

                            <Link to="/signup">
                              <Button variant="outline" size="small" className="text-xs py-1.5 px-3">
                                View Order
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Row 3: Logitech Mouse (Overdue Refund) */}
                      {(dashboardFilter === 'all' || dashboardFilter === 'urgent' || dashboardFilter === 'refunds') && (
                        <div className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                              CR
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-[#F5F7FA] flex flex-wrap items-center gap-2">
                                <span className="truncate">Logitech MX Master 3S Ergonomic Mouse</span>
                                <span className="text-[10px] text-slate-400 font-mono font-normal">#CRO-18302</span>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Croma Retail</span>
                                <span>•</span>
                                <span className="font-bold text-rose-600 dark:text-rose-400">₹7,995 Expected</span>
                                <span>•</span>
                                <span>Pickup Completed Aug 29</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 self-start md:self-center shrink-0">
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/60">
                              Overdue by 3 Days
                            </span>

                            <StatusBadge status="refund-overdue" size="small" />

                            <Link to="/signup">
                              <Button variant="danger" size="small" className="text-xs py-1.5 px-3 whitespace-nowrap">
                                Flag Overdue
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </>
                  )}

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
      {/* 6.5 INTERACTIVE RESOLUTION PIPELINE SHOWCASE (HOW IT WORKS) */}
      {/* ========================================================================= */}
      <InteractivePipelineShowcase />

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
