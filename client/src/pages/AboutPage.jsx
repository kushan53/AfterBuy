import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, ShieldCheck, HeartHandshake, Sparkles, ShoppingBag, RotateCcw, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PublicFooter } from '../components/layout/PublicFooter';

export const AboutPage = () => {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#0F1115] text-slate-900 dark:text-[#F5F7FA] selection:bg-blue-100 selection:text-blue-700 flex flex-col justify-between transition-colors duration-200">
      {/* Header (Fixed at top-0, stays visible on scroll, zero top gap) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/80 dark:border-[#22262F] bg-white/95 dark:bg-[#11141A]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center tracking-wider shadow-xs">
              AB
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
                AFTERBUY
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#747C89] font-medium tracking-tight">
                Everything after you buy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/signup">
              <Button variant="primary" size="small">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-22 pb-12 sm:pt-26 sm:pb-16 flex-1 w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-slate-800 dark:hover:text-[#F5F7FA] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white dark:bg-[#171A21] p-4 sm:p-8 md:p-10 rounded-2xl border border-slate-200/90 dark:border-[#292E38] shadow-sm space-y-8 sm:space-y-10">
          <div className="border-b border-slate-100 dark:border-[#22262F] pb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-[11px] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consumer Advocacy Tech</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
              Everything after you buy.
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#A9B0BC] mt-2 max-w-2xl leading-relaxed">
              Every year, consumers lose billions in missed return deadlines, untracked merchant refunds, and forgotten manufacturer warranties. We built AfterBuy to put control back in your hands.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200/80 dark:border-[#292E38] bg-slate-50/50 dark:bg-[#13161C] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">Zero Missed Deadlines</h3>
              <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
                Automated proactive alerts before 7-day, 10-day, or 14-day store return windows snap shut.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200/80 dark:border-[#292E38] bg-slate-50/50 dark:bg-[#13161C] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-sm">
                <RotateCcw className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">Refund Recovery</h3>
              <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
                Logistics tracking that spots when merchants pick up a package but delay crediting your bank account.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200/80 dark:border-[#292E38] bg-slate-50/50 dark:bg-[#13161C] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">Digital Warranty Vault</h3>
              <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
                Store receipts, invoices, and serial numbers safely so you can make warranty claims years after buying.
              </p>
            </div>
          </div>

          {/* Story & Philosophy */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Why We Exist</h2>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              E-commerce platforms like Amazon, Flipkart, and Apple have perfected the checkout experience — one click and your package is on its way. But the second delivery occurs, you're on your own. Complicated return policies, confusing refund cycles, and lost invoices create endless friction.
            </p>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              AfterBuy was created as an independent consumer layer. We don’t work for the stores. We don’t sell your data. We build software that guarantees you extract every bit of value, protection, and money you are owed after making a purchase.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">Take control of your post-purchase life</h4>
              <p className="text-xs text-slate-600 dark:text-[#A9B0BC] mt-0.5">Free to track up to 25 lifetime purchases with automated alerts.</p>
            </div>
            <Link to="/signup">
              <Button variant="primary" size="medium">
                Create Free Account →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Standardized 1-Line Footer */}
      <PublicFooter />
    </div>
  );
};
