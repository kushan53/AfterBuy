import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Dropdown, DropdownItem, DropdownLabel } from '../ui/Dropdown';

/**
 * AuthLayout
 * 
 * Clean, production-grade centered SaaS authentication layout.
 * - Matches the existing public AfterBuy navbar styling
 * - Clean AfterBuy logo on the left
 * - Minimal "Back to Home" and theme toggle on the right
 * - Subtle ambient glow, no promotional/marketing distraction
 * - Responsive: 20-24px mobile padding, centered 400-440px container on desktop
 */
export const AuthLayout = ({ children }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-[#0B0E14] flex flex-col justify-between text-slate-900 dark:text-[#F5F7FA] relative selection:bg-blue-100 selection:text-blue-700 transition-colors duration-200">
      {/* Very subtle blue/purple ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-blue-100/40 via-indigo-50/10 to-transparent dark:from-blue-900/10 dark:via-transparent pointer-events-none blur-3xl -z-10" />

      {/* Top Navbar matching public AfterBuy navbar styling */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-[#22262F] bg-white dark:bg-[#11141A]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo on the left */}
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

          {/* Right Navigation: Theme Toggle + Back to Home */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* Theme Toggle */}
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
            </Dropdown>

            {/* Back to Home Link */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-[#A9B0BC] hover:text-slate-900 dark:hover:text-white transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A1F2B]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container - Centered Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px] sm:max-w-[440px] mx-auto">
          {children}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-slate-200/60 dark:border-[#1E2430] py-5 px-4 text-center text-xs text-slate-400 dark:text-[#747C89]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-[#656D7C]">
            © {new Date().getFullYear()} AfterBuy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
