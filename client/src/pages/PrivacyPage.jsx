import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PublicFooter } from '../components/layout/PublicFooter';

export const PrivacyPage = () => {
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Consumer Data Protection</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 dark:text-[#747C89] mt-1">
              Effective Date: September 2, 2026 • Last Updated: September 2, 2026
            </p>
          </div>

          {/* Privacy Commitments Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#292E38]">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Bank Access</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC]">We never request or connect to your bank or card credentials.</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">
                <EyeOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>No Data Selling</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC]">Your receipts and purchase history are never monetized or shared.</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">
                <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Encrypted Storage</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#A9B0BC]">All uploaded receipts and order metadata are stored securely.</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">1. Information We Collect</h2>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              We collect information you explicitly provide to help track your post-purchase lifecycle:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-[#A9B0BC] space-y-1.5 pl-2">
              <li><strong>Account Information:</strong> Name, email address, and encrypted credentials.</li>
              <li><strong>Purchase & Order Data:</strong> Item names, merchants, order IDs, purchase amounts, delivery dates, and return window terms you enter.</li>
              <li><strong>Documents:</strong> Invoices, receipts, and warranty cards you upload for record-keeping.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">2. How We Use Your Information</h2>
            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              We strictly use your information to operate the personal post-purchase service:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-[#A9B0BC] space-y-1.5 pl-2">
              <li>Calculating and alerting you when return deadlines approach.</li>
              <li>Tracking pending and overdue refund amounts.</li>
              <li>Alerting you before manufacturer warranties expire.</li>
              <li>Maintaining your secure digital purchase document archive.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Information Sharing & Third Parties</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              AfterBuy does <strong>not</strong> sell, rent, license, or trade your shopping history, order receipts, or personal details to advertisers, data brokers, or e-commerce marketplaces.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">4. Data Deletion & Your Rights</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              You retain full control over your data. You may delete individual purchases, remove uploaded invoice files, or delete your entire account at any time through account preferences. Upon deletion, your data is completely purged from active storage.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
            <span>Privacy inquiries: <a href="mailto:privacy@afterbuy.io" className="text-blue-600 hover:underline">privacy@afterbuy.io</a></span>
          </div>
        </div>
      </main>

      {/* Standardized 1-Line Footer */}
      <PublicFooter />
    </div>
  );
};
