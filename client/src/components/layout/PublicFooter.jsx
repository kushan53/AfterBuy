import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Standardized 1-line footer used across all non-landing pages
 * (Login, Signup, About Us, Contact Us, Terms of Service, Privacy Policy)
 */
export const PublicFooter = ({ className = '' }) => {
  return (
    <footer className={`mt-auto w-full border-t border-slate-200/90 dark:border-[#22262F] bg-white dark:bg-[#11141A] py-4 text-xs text-slate-400 dark:text-[#747C89] transition-colors duration-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p>© 2026 AfterBuy Inc. Everything after you buy.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-500 dark:text-[#A9B0BC] text-xs font-medium">
          <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 transition-colors">
            Contact
          </Link>
          <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
};
