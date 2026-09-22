import React, { useState } from 'react';
import { Phone, ShieldCheck, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

export const PhoneRecoveryBanner = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('afterbuy_phone_banner_dismissed') === 'true';
  });

  // If user already has a phone number linked or dismissed banner for this session, hide it
  if (user?.phone || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem('afterbuy_phone_banner_dismissed', 'true');
    setDismissed(true);
  };

  const handleLinkPhone = async (e) => {
    e.preventDefault();
    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formattedPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone}` : `+${cleanPhone}`;
      await updateUser({ phone: formattedPhone });
      setSuccess(true);
      addToast({
        title: 'Mobile Number Linked!',
        message: 'Your account is now secured with SMS recovery & instant account discovery.',
        type: 'success',
      });
      setTimeout(() => {
        setDismissed(true);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-purple-50/80 dark:from-[#111625] dark:via-[#141829] dark:to-[#1a152d] p-4 sm:p-5 shadow-xs transition-all duration-300">
      {/* Background Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        aria-label="Dismiss banner"
        title="Remind me later"
      >
        <X className="w-4 h-4" />
      </button>

      {success ? (
        <div className="flex items-center gap-3 py-1 text-emerald-700 dark:text-emerald-400">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Phone Number Linked Successfully!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              You can now use your phone number to find your account and receive instant verification codes.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Info Column */}
          <div className="flex items-start gap-3.5 max-w-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Phone className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/60 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  Account Security
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Enable 1-Click Phone Recovery
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
                Add your mobile number so you can instantly log in and recover your account if you ever forget your email or password.
              </p>
            </div>
          </div>

          {/* Right Action / Inline Form */}
          <form onSubmit={handleLinkPhone} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
                +91
              </div>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => {
                  setPhoneInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="10-digit mobile number"
                maxLength={14}
                className="w-full sm:w-56 h-10 pl-11 pr-3 rounded-xl border border-slate-200 dark:border-[#2A3142] bg-white dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-xs focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !phoneInput.trim()}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 active:from-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Link Phone</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium pl-13">
          {error}
        </p>
      )}
    </div>
  );
};
