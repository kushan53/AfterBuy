import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PublicFooter } from '../components/layout/PublicFooter';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1115] text-slate-900 dark:text-[#F5F7FA] selection:bg-blue-100 selection:text-blue-700 flex flex-col justify-between transition-colors duration-200">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-200/80 dark:border-[#22262F] bg-white/90 dark:bg-[#11141A]/90 backdrop-blur-md sticky top-0 z-20">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-slate-800 dark:hover:text-[#F5F7FA] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white dark:bg-[#171A21] p-4 sm:p-8 md:p-10 rounded-2xl border border-slate-200/90 dark:border-[#292E38] shadow-sm space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 dark:border-[#22262F] pb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-[11px] font-semibold mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400 dark:text-[#747C89] mt-1">
              Effective Date: September 2, 2026 • Last Updated: September 2, 2026
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">1. Acceptance of Terms</h2>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              By accessing, browsing, or using the AfterBuy web application ("Service"), you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, you may not access or use the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">2. Service Description & User Role</h2>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              AfterBuy is a personal post-purchase tracking utility designed to assist consumers in organizing their purchase receipts, return deadlines, expected refunds, and manufacturer warranties. 
            </p>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              AfterBuy is an independent management tool. We do not process banking transactions, negotiate on your behalf with merchants (e.g. Amazon, Flipkart, Apple), or guarantee that merchants will accept individual return requests or honor warranty claims. You remain responsible for initiating actual returns with the respective seller.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">3. User Accounts & Security</h2>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              To use certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-[#A9B0BC] space-y-1.5 pl-2">
              <li>Provide accurate and complete registration information.</li>
              <li>Maintain the confidentiality of your account login credentials.</li>
              <li>Notify AfterBuy immediately of any unauthorized access to your account.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">4. Ownership & User Data</h2>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              You retain 100% ownership of all receipt images, invoices, purchase details, and metadata you upload to AfterBuy. We do not sell your shopping or spending data to advertisers or third-party brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">5. Limitation of Liability</h2>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              AfterBuy provides automated calculation tools for return windows and warranty periods based on data you enter or sync. While we strive for maximum accuracy, we cannot be held liable for missed return deadlines, merchant policy changes, or denied warranty claims.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">6. Modifications & Termination</h2>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              We reserve the right to modify or terminate the Service at any time. In the event of discontinuation, users will be provided reasonable opportunity to export their post-purchase ledger and receipts.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
            <span>Questions regarding terms? Contact us at <a href="mailto:legal@afterbuy.io" className="text-blue-600 hover:underline">legal@afterbuy.io</a></span>
          </div>
        </div>
      </main>

      {/* Standardized 1-Line Footer */}
      <PublicFooter />
    </div>
  );
};
