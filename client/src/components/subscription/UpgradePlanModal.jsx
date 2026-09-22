import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  X,
  ArrowRight,
  Infinity as InfinityIcon,
  Bot,
  MessageSquare,
  FileSpreadsheet
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

export const UpgradePlanModal = ({ isOpen, onClose, defaultCycle = 'annual' }) => {
  const { upgradePlan } = useAuth();
  const { addToast } = useToast();

  const [billingCycle, setBillingCycle] = useState(defaultCycle); // 'monthly' | 'annual'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const priceMonthly = 149;
  const priceAnnual = 1299;
  const activePrice = billingCycle === 'annual' ? priceAnnual : priceMonthly;

  const handleActivate = async () => {
    setIsProcessing(true);

    // Simulate authentic payment processing delay
    await new Promise((r) => setTimeout(r, 1200));

    try {
      await upgradePlan({
        billingCycle,
        paymentMethod: paymentMethod.toUpperCase(),
      });

      setIsProcessing(false);
      setIsSuccess(true);

      addToast({
        title: '🌟 Welcome to AfterBuy Pro!',
        message: `Your ${billingCycle === 'annual' ? 'Annual' : 'Monthly'} Pro membership is now live with unlimited items and AI scanning.`,
        type: 'success',
      });

      // Auto close after celebrating
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setIsProcessing(false);
      addToast({
        title: 'Upgrade Failed',
        message: err.message || 'Could not complete subscription.',
        type: 'error',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) {
          setIsSuccess(false);
          onClose();
        }
      }}
      title=""
      size="max-w-2xl"
    >
      {isSuccess ? (
        <div className="py-10 px-4 text-center space-y-4 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/25">
            <Sparkles className="w-10 h-10 animate-pulse" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2 border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Payment Verified • ₹{activePrice}
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-[#F5F7FA]">
              You're Now an AfterBuy Pro!
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] max-w-md mx-auto mt-2">
              Your 25-item limit has been lifted to <strong>Unlimited</strong>. All premium features including AI Bill Scanner, WhatsApp Sentinel, and 10GB cloud vault are activated.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Upgrade to AfterBuy Pro
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5F7FA] tracking-tight">
              Supercharge Your Consumer Protection
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1 max-w-lg mx-auto">
              Lift the 25-purchase limit, automate bill entries with AI, and get WhatsApp reminders before return deadlines expire.
            </p>
          </div>

          {/* Billing Cycle Selector */}
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#13161C] border border-slate-200 dark:border-[#292E38]">
            {/* Monthly Option */}
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`p-3.5 rounded-xl text-left transition-all relative cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-[#1C2028] shadow-sm border-2 border-blue-600 text-slate-900 dark:text-[#F5F7FA]'
                  : 'border-2 border-transparent text-slate-600 dark:text-[#A9B0BC] hover:bg-white/50 dark:hover:bg-[#171A21]/60'
              }`}
            >
              <div className="text-xs font-bold">Monthly Plan</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-[#F5F7FA]">₹{priceMonthly}</span>
                <span className="text-[11px] text-slate-500 dark:text-[#747C89]">/ month</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-[#747C89] mt-1">Flexible monthly renewal</p>
            </button>

            {/* Annual Option */}
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`p-3.5 rounded-xl text-left transition-all relative cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-white dark:bg-[#1C2028] shadow-sm border-2 border-blue-600 text-slate-900 dark:text-[#F5F7FA]'
                  : 'border-2 border-transparent text-slate-600 dark:text-[#A9B0BC] hover:bg-white/50 dark:hover:bg-[#171A21]/60'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Save 28%
              </div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>Annual Plan</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">(Best Value)</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-[#F5F7FA]">₹{priceAnnual}</span>
                <span className="text-[11px] text-slate-500 dark:text-[#747C89]">/ year</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-[#747C89] mt-1">Just ~₹108/month billed annually</p>
            </button>
          </div>

          {/* Pro Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs">
            <div className="flex items-center gap-2 text-slate-800 dark:text-[#F5F7FA]">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <InfinityIcon className="w-3.5 h-3.5" />
              </div>
              <span><strong>Unlimited</strong> Purchases & Warranties</span>
            </div>

            <div className="flex items-center gap-2 text-slate-800 dark:text-[#F5F7FA]">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span><strong>AI Smart Scanner</strong> auto-fills bills</span>
            </div>

            <div className="flex items-center gap-2 text-slate-800 dark:text-[#F5F7FA]">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span><strong>WhatsApp & SMS</strong> Sentinel Expiry Alerts</span>
            </div>

            <div className="flex items-center gap-2 text-slate-800 dark:text-[#F5F7FA]">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </div>
              <span><strong>10 GB Cloud Vault</strong> & Tax CSV Exports</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-[#22262F]">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
              <span>Select Payment Method</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                256-Bit SSL Encrypted
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                    : 'border-slate-200 dark:border-[#292E38] text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-50 dark:hover:bg-[#1C2028]'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                    : 'border-slate-200 dark:border-[#292E38] text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-50 dark:hover:bg-[#1C2028]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                    : 'border-slate-200 dark:border-[#292E38] text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-50 dark:hover:bg-[#1C2028]'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Method Details */}
            {paymentMethod === 'upi' && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F] flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">UPI Handle (GPay / PhonePe / Paytm)</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-[#F5F7FA]">{upiId}</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40">
                  Auto-Verified
                </span>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F] flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Credit / Debit Card</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-[#F5F7FA]">{cardNumber}</span>
                </div>
                <span className="text-[10px] text-slate-400">Exp: 12/28</span>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F] text-xs text-slate-600 dark:text-[#A9B0BC]">
                Supported Banks: HDFC Bank, State Bank of India, ICICI Bank, Axis Bank.
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#22262F]">
            <div>
              <span className="text-[11px] text-slate-400 block">Total Due Today</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-900 dark:text-[#F5F7FA]">₹{activePrice}</span>
                <span className="text-[11px] text-slate-500">
                  (Includes all taxes)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleActivate}
                disabled={isProcessing}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 px-5"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Activating Pro...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-bold">
                    Pay ₹{activePrice} & Activate
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
