import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { UnifiedAuthCard } from '../components/auth/UnifiedAuthCard';
import { PublicFooter } from '../components/layout/PublicFooter';

export const SignupPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-[#0B0E14] flex flex-col justify-between text-slate-900 dark:text-[#F5F7FA] relative overflow-hidden selection:bg-blue-100 selection:text-blue-700 transition-colors duration-200">
      {/* Ambient Lighting Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-blue-100/60 via-indigo-50/20 to-transparent dark:from-blue-900/15 dark:via-transparent pointer-events-none blur-3xl -z-10" />

      {/* Top Navbar */}
      <header className="w-full border-b border-slate-200/80 dark:border-[#1E2430] bg-white/80 dark:bg-[#0E121A]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center tracking-wider shadow-sm">
              AB
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
                AFTERBUY
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#747C89] font-medium tracking-tight">
                Everything after you buy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link to="/" className="text-slate-500 dark:text-[#A9B0BC] hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[420px]">
          <UnifiedAuthCard defaultMode="signup" />
        </div>
      </main>

      {/* Standardized 1-Line Footer */}
      <PublicFooter />
    </div>
  );
};

export default SignupPage;
