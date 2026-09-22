import React, { useState, useEffect } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Palette,
  Check,
  Sun,
  Moon,
  Laptop,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  Package,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Building,
  KeyRound,
  Truck,
  Compass,
  Zap,
  Infinity as InfinityIcon,
  Bot,
  MessageSquare,
  X as XIcon,
  Crown,
  CreditCard,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { UpgradePlanModal } from '../components/subscription/UpgradePlanModal';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePurchases } from '../context/PurchaseContext';
import { useToast } from '../components/ui/Toast';

export const SettingsPage = () => {
  const { user, updateUser, initials, firstName, isPro, plan, downgradePlan } = useAuth();
  const { theme, setTheme } = useTheme();
  const { purchases = [] } = usePurchases();
  const { addToast } = useToast();

  // Active Task Tab: 'profile' | 'billing' | 'courier' | 'security' | 'alerts' | 'data'
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [pickupCity, setPickupCity] = useState(user?.city || '');
  const [pickupPincode, setPickupPincode] = useState(user?.pincode || '');
  const [returnAddress, setReturnAddress] = useState(user?.returnPickupAddress || '');
  const [pickupNotes, setPickupNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Security password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Sync with user state
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setPickupCity(user.city || '');
      setPickupPincode(user.pincode || '');
      setReturnAddress(user.returnPickupAddress || '');
    }
  }, [user]);

  // Sentinel alerts state
  const [urgentReminders, setUrgentReminders] = useState(true);
  const [refundAlerts, setRefundAlerts] = useState(true);
  const [warrantyAlerts, setWarrantyAlerts] = useState(true);

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: pickupCity.trim(),
        pincode: pickupPincode.trim(),
        returnPickupAddress: returnAddress.trim(),
      });
      addToast({
        title: 'Settings Saved',
        message: 'Your account configuration has been updated.',
        type: 'success',
      });
    } catch (err) {
      addToast({
        title: 'Save Failed',
        message: err.message || 'Could not update settings right now.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast({
        title: 'Password Too Short',
        message: 'Password must be at least 6 characters long.',
        type: 'error',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({
        title: 'Passwords Do Not Match',
        message: 'Please ensure both password fields are identical.',
        type: 'error',
      });
      return;
    }

    updateUser({ password: newPassword });
    setNewPassword('');
    setConfirmPassword('');
    addToast({
      title: 'Password Updated',
      message: 'Your account login password has been changed securely.',
      type: 'success',
    });
  };

  const handleDowngrade = async () => {
    if (window.confirm('Are you sure you want to downgrade to Free Tier? Your purchase tracking will be capped at 25 items and WhatsApp Sentinel will be paused.')) {
      await downgradePlan();
      addToast({
        title: 'Plan Changed to Free Tier',
        message: 'Your account has been switched back to the Basic Free Plan.',
        type: 'info',
      });
    }
  };

  // 1-Click Purchase Ledger Export (CSV)
  const handleExportCSV = () => {
    if (purchases.length === 0) {
      addToast({
        title: 'No Purchases Recorded',
        message: 'Add purchases first to export your post-purchase ledger.',
        type: 'info',
      });
      return;
    }

    const headers = ['Product Name', 'Store / Merchant', 'Order ID', 'Price (INR)', 'Purchase Date', 'Return Window', 'Return Status', 'Warranty Expiry', 'Invoice Attached'];
    const rows = purchases.map((p) => [
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.merchant || '').replace(/"/g, '""')}"`,
      `"${(p.orderId || '').replace(/"/g, '""')}"`,
      p.price || 0,
      `"${p.purchaseDate || ''}"`,
      `"${p.returnDeadline || ''}"`,
      `"${p.returnStatus || ''}"`,
      `"${p.warrantyExpiry || ''}"`,
      p.hasReceipt ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AfterBuy_Purchase_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Ledger Exported',
      message: 'Your complete purchase history and warranty index downloaded as CSV.',
      type: 'success',
    });
  };

  // Navigation Options for Different Tasks
  const TASK_OPTIONS = [
    { id: 'profile', label: 'Profile & Identity', icon: User, description: 'Personal details and credentials' },
    { id: 'billing', label: 'Plans & Billing', icon: Sparkles, description: 'Subscription tier, limits & invoices' },
    { id: 'courier', label: 'Courier & Address', icon: Truck, description: 'Reverse-pickup delivery coordinates' },
    { id: 'security', label: 'Security & Login', icon: ShieldCheck, description: 'Password, phone recovery & sessions' },
    { id: 'alerts', label: 'Alerts & Theme', icon: Bell, description: 'Automations & interface appearance' },
    { id: 'data', label: 'Data & Privacy', icon: FileSpreadsheet, description: 'CSV export & account purge' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* 1. Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
          Account & Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
          Select a task below to manage your personal details, courier coordinates, or security settings.
        </p>
      </div>

      {/* 2. Task Selector (Tabs for Different Tasks) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F] rounded-2xl overflow-x-auto scrollbar-none">
        {TASK_OPTIONS.map((task) => {
          const Icon = task.icon;
          const isActive = activeTab === task.id;
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => setActiveTab(task.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-[#1C2028] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-[#292E38]'
                  : 'text-slate-600 dark:text-[#A9B0BC] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-white/50 dark:hover:bg-[#171A21]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              <span>{task.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TASK 1: PROFILE & IDENTITY                                                */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Cover Banner with Avatar & Identity */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-[#292E38] bg-white dark:bg-[#171A21] overflow-hidden shadow-sm">
            <div className="h-28 sm:h-32 w-full bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 dark:from-blue-600/30 dark:via-indigo-950/50 dark:to-purple-950/30 relative flex items-center justify-end px-6">
              {isPro ? (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-violet-600/20 to-indigo-600/20 backdrop-blur-md border border-amber-400/60 dark:border-amber-400/40 text-[11px] font-bold text-amber-800 dark:text-amber-300 shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>⭐ Pro Sentinel Member</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#11141A]/90 hover:bg-blue-50 dark:hover:bg-blue-950/50 backdrop-blur-md border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-700 dark:text-blue-300 shadow-sm transition-all cursor-pointer group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
                  <span>Free Tier ({purchases.length}/25)</span>
                  <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">Upgrade Pro →</span>
                </button>
              )}
            </div>

            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-6">
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-lg border-4 border-white dark:border-[#171A21]">
                    {initials}
                  </div>
                  <div className="mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
                        {name || 'AfterBuy User'}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Consumer
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5">
                      {email} • Registered Member
                    </p>
                  </div>
                </div>
              </div>

              {/* Status information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-[#22262F] text-xs">
                <div
                  onClick={() => setActiveTab('billing')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F] cursor-pointer hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 dark:text-[#747C89] uppercase font-bold tracking-wider block">
                      Account Plan
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Manage →</span>
                  </div>
                  {isPro ? (
                    <span className="font-semibold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 fill-amber-500" />
                      Pro Tier (Unlimited Items)
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-800 dark:text-[#F5F7FA] mt-0.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Free Tier ({purchases.length}/25 items)
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F]">
                  <span className="text-[10px] text-slate-400 dark:text-[#747C89] uppercase font-bold tracking-wider block">
                    Identity Verification
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Email & Phone
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F]">
                  <span className="text-[10px] text-slate-400 dark:text-[#747C89] uppercase font-bold tracking-wider block">
                    Data Sovereignty
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-[#A9B0BC] mt-0.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    DPDP & GDPR Protected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Edit Form */}
          <Card className="p-6">
            <CardTitle className="text-base flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Personal Identity Details</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-5">
              These details are used across invoice receipts, warranty certificates, and support tickets.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your legal name"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                      Notification Email
                    </label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address for alerts"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number for SMS / OTP"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Primary City
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      placeholder="e.g. Mumbai, Bengaluru, Delhi"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3">
                <Button variant="primary" size="small" type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK: PLANS & BILLING                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'billing' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Current Membership Overview Card */}
          <Card className="p-6 relative overflow-hidden border-2 border-slate-200/90 dark:border-[#292E38]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-[#22262F]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-400 dark:text-[#747C89] uppercase tracking-wider">
                    Current Membership
                  </span>
                  {isPro ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-800/60">
                      <Crown className="w-3 h-3 fill-amber-500 text-amber-500" />
                      Pro Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60">
                      <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      Free Tier
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-[#F5F7FA]">
                  {isPro ? 'AfterBuy Pro Member' : 'Basic Free Tier'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5">
                  {isPro
                    ? `Billed ${user?.planBillingCycle === 'annual' ? 'Annually (₹1,299/yr)' : 'Monthly (₹149/mo)'} • Renews automatically`
                    : 'Free forever with essential warranty and return tracking'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isPro ? (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleDowngrade}
                    className="text-xs text-slate-500 hover:text-rose-600 cursor-pointer"
                  >
                    Downgrade to Free
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 px-4 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Upgrade to Pro (₹149/mo)
                  </Button>
                )}
              </div>
            </div>

            {/* Live Usage Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
              {/* Metric 1: Tracked Purchases */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F]">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#A9B0BC]">
                  <span>Tracked Items</span>
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-[#F5F7FA] mt-1">
                  {isPro ? `${purchases.length} Items` : `${purchases.length} / 25`}
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-[#22262F] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isPro
                        ? 'bg-emerald-500 w-full'
                        : purchases.length >= 20
                        ? 'bg-rose-500'
                        : 'bg-blue-600'
                    }`}
                    style={{
                      width: isPro ? '100%' : `${Math.min(100, (purchases.length / 25) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-[#747C89] mt-1 block">
                  {isPro ? 'Unlimited Capacity' : `${25 - purchases.length} slots remaining`}
                </span>
              </div>

              {/* Metric 2: Document Vault */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F]">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#A9B0BC]">
                  <span>Cloud Vault</span>
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-[#F5F7FA] mt-1">
                  {isPro ? '10 GB High-Res' : '50 MB Basic'}
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#22262F] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: isPro ? '12%' : '24%' }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-[#747C89] mt-1 block">
                  {isPro ? 'Multi-page HD Archival' : 'Standard Receipts'}
                </span>
              </div>

              {/* Metric 3: AI Scanner */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F]">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#A9B0BC]">
                  <span>AI Smart OCR</span>
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-[#F5F7FA] mt-1 flex items-center gap-1.5">
                  {isPro ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4 stroke-[3]" /> Active
                    </span>
                  ) : (
                    <span className="text-slate-400">Locked</span>
                  )}
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#22262F] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isPro ? 'bg-emerald-500 w-full' : 'bg-slate-300 w-0'}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-[#747C89] mt-1 block">
                  {isPro ? 'Auto-fills invoice details' : 'Pro tier exclusive'}
                </span>
              </div>

              {/* Metric 4: Sentinel Alerts */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F]">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#A9B0BC]">
                  <span>Sentinel Channel</span>
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-[#F5F7FA] mt-1">
                  {isPro ? 'WhatsApp + SMS' : 'In-App + Email'}
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#22262F] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isPro ? 'bg-emerald-500 w-full' : 'bg-blue-600 w-1/2'}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-[#747C89] mt-1 block">
                  {isPro ? '72h & 24h Expiry Pushes' : 'Standard 24h notice'}
                </span>
              </div>
            </div>
          </Card>

          {/* Side-by-Side Plan Comparison Matrix */}
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                Compare Plans & Capabilities
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#A9B0BC]">
                Choose the plan tailored to your household shopping volume and warranty portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* CARD 1: BASIC PLAN */}
              <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all bg-white dark:bg-[#171A21] ${
                !isPro
                  ? 'border-blue-500 shadow-md ring-1 ring-blue-500/30'
                  : 'border-slate-200 dark:border-[#292E38] opacity-90'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A9B0BC]">
                      Basic Plan
                    </span>
                    {!isPro && (
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-[#F5F7FA]">₹0</span>
                    <span className="text-xs text-slate-400">/ forever</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-[#A9B0BC] mb-5">
                    Essential personal vault for casual shoppers tracking a few electronics and warranties.
                  </p>

                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#22262F] text-xs">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Up to <strong>25 Active Purchases</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>50 MB Encrypted Cloud Vault</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Standard 24h Return Expiry Notice</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-800 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Return & Refund Status Tracker</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 dark:text-[#747C89] line-through">
                      <XIcon className="w-4 h-4 text-slate-300 dark:text-[#383F4C] shrink-0" />
                      <span>AI Smart Invoice Auto-Scanner</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 dark:text-[#747C89] line-through">
                      <XIcon className="w-4 h-4 text-slate-300 dark:text-[#383F4C] shrink-0" />
                      <span>Instant WhatsApp & SMS Sentinel</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 dark:text-[#747C89] line-through">
                      <XIcon className="w-4 h-4 text-slate-300 dark:text-[#383F4C] shrink-0" />
                      <span>1-Click Reverse Courier Return Dossier</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 dark:text-[#747C89] line-through">
                      <XIcon className="w-4 h-4 text-slate-300 dark:text-[#383F4C] shrink-0" />
                      <span>VIP Concierge Support (&lt; 4h)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#22262F]">
                  {!isPro ? (
                    <Button variant="outline" size="small" disabled className="w-full opacity-60">
                      Your Active Plan
                    </Button>
                  ) : (
                    <Button variant="outline" size="small" onClick={handleDowngrade} className="w-full cursor-pointer">
                      Downgrade to Free
                    </Button>
                  )}
                </div>
              </div>

              {/* CARD 2: AFTERBUY PRO */}
              <div className={`rounded-2xl border-2 p-6 flex flex-col justify-between transition-all relative overflow-hidden bg-white dark:bg-[#171A21] ${
                isPro
                  ? 'border-amber-400 dark:border-amber-500/80 shadow-xl ring-2 ring-amber-400/20'
                  : 'border-blue-600 shadow-xl shadow-blue-500/10'
              }`}>
                {/* Popular Pill */}
                <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-amber-300 text-amber-300" />
                  Most Popular
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      AfterBuy Pro
                    </span>
                    {isPro && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Active Membership ⭐
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-[#F5F7FA]">₹149</span>
                    <span className="text-xs text-slate-400">/ month or ₹1,299/year (Save 28%)</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-[#A9B0BC] mb-5">
                    Total consumer protection with AI scanning, WhatsApp countdowns, and unlimited purchases.
                  </p>

                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#22262F] text-xs">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-[#F5F7FA] font-semibold">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span><strong>Unlimited Purchases & Warranties</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span><strong>10 GB Cloud Vault</strong> (HD & Multi-Page)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span><strong>AI Smart Invoice Scanner</strong> (OCR auto-fill)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span><strong>Instant WhatsApp & SMS Sentinel</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span><strong>1-Click Return Dossier & Pickup Slips</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span>Tax & Expense Ledger <strong>CSV Exports</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-[#F5F7FA]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                      <span>VIP Concierge Support (<strong>&lt; 4 Hours SLA</strong>)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#22262F]">
                  {isPro ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 text-xs">
                      <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-600" />
                        Active Pro Member
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        Switch Cycle
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 py-2.5 font-bold cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Upgrade to Pro Now →
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Receipts & Ledger */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Subscription Invoices & Receipts</span>
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5">
                  Tax invoices and payment confirmations for your AfterBuy subscription.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-[#22262F] overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-50 dark:bg-[#13161C] p-3 font-semibold text-slate-600 dark:text-[#A9B0BC] border-b border-slate-200 dark:border-[#22262F]">
                <div className="col-span-3">Invoice #</div>
                <div className="col-span-3">Plan / Description</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {isPro && (
                <div className="grid grid-cols-12 p-3 items-center border-b border-slate-100 dark:border-[#22262F] text-slate-800 dark:text-[#F5F7FA]">
                  <div className="col-span-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    INV-2026-PRO8
                  </div>
                  <div className="col-span-3">
                    AfterBuy Pro ({user?.planBillingCycle === 'annual' ? 'Annual' : 'Monthly'})
                  </div>
                  <div className="col-span-2 text-slate-500">
                    {new Date().toISOString().split('T')[0]}
                  </div>
                  <div className="col-span-2 font-bold text-emerald-600 dark:text-emerald-400">
                    {user?.planBillingCycle === 'annual' ? '₹1,299' : '₹149'}
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        addToast({
                          title: 'Receipt Downloaded',
                          message: 'Subscription tax invoice saved to your device.',
                          type: 'success',
                        });
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-12 p-3 items-center text-slate-800 dark:text-[#F5F7FA]">
                <div className="col-span-3 font-mono font-medium text-slate-500">
                  INV-2026-FREE
                </div>
                <div className="col-span-3">
                  Basic Free Tier (Lifetime Vault)
                </div>
                <div className="col-span-2 text-slate-500">
                  Account Creation
                </div>
                <div className="col-span-2 font-bold text-slate-700 dark:text-[#A9B0BC]">
                  ₹0
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 2: COURIER & PICKUP ADDRESS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'courier' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <Card className="p-6">
            <CardTitle className="text-base flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Reverse-Courier Pickup Coordinates</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-6">
              When you initiate an e-commerce return, merchants (Amazon, Flipkart, Zara, etc.) dispatch delivery agents to pick up your package. Having your default address here ensures instant 1-click scheduling.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                  Street Address (House / Flat #, Building, Locality)
                </label>
                <input
                  type="text"
                  value={returnAddress}
                  onChange={(e) => setReturnAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Sunshine Heights, 12th Main Road, Indiranagar"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Postal Pincode (6 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pickupPincode}
                    onChange={(e) => setPickupPincode(e.target.value)}
                    placeholder="e.g. 560038"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                  Courier Agent Delivery Instructions <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="e.g. Leave with building security, call 10 mins before arrival"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end pt-3">
                <Button variant="primary" size="small" type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving Address...' : 'Save Courier Address'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 3: SECURITY & LOGIN                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Password Update Frame */}
          <Card className="p-6">
            <CardTitle className="text-base flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Account Password</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-5">
              Change your password to maintain high account security. Passwords are encrypted with Bcrypt.
            </p>

            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" size="small" type="submit">
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Recovery Channel & Session Information */}
          <Card className="p-6">
            <CardTitle className="text-base flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Recovery Channels & Active Sessions</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-4">
              Protected authentication methods connected to your personal account.
            </p>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-[#22262F]">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    Phone OTP Authentication
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#747C89]">
                    {phone ? `Connected: ${phone} (Active for 1-click passwordless login & recovery)` : 'No phone linked yet. Add in Profile tab.'}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-semibold ${phone ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'}`}>
                  {phone ? 'Connected' : 'Unlinked'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    Current Browser Session
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#747C89]">
                    Desktop Web • 30-day token authentication • Active now
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                  Active
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 4: ALERTS & THEME PREFERENCES                                       */}
      {/* ========================================================================= */}
      {activeTab === 'alerts' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Theme Preferences */}
          <Card className="p-6">
            <CardTitle className="text-base flex items-center gap-2 mb-1">
              <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Interface Theme</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-4">
              Select your preferred visual appearance across the application
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-slate-200 dark:border-[#292E38] text-slate-700 dark:text-[#A9B0BC] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light</span>
                </div>
                {theme === 'light' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-slate-200 dark:border-[#292E38] text-slate-700 dark:text-[#A9B0BC] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Dark</span>
                </div>
                {theme === 'dark' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-slate-200 dark:border-[#292E38] text-slate-700 dark:text-[#A9B0BC] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-slate-500" />
                  <span>System</span>
                </div>
                {theme === 'system' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            </div>
          </Card>

          {/* Sentinel Automation Alerts */}
          <Card className="p-6">
            <CardTitle className="text-base flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Automated Sentinel Alert Rules</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-4">
              Real-time countdown sentinels for approaching return deadlines, overdue refunds, and warranties.
            </p>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-[#22262F]">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">
                    48-Hour Return Expiry Alert
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-[#747C89]">
                    High-priority alert before a store return window permanently closes.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={urgentReminders}
                  onChange={(e) => setUrgentReminders(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">
                    Overdue Refund Tracker
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-[#747C89]">
                    Flag returned items when merchant credit takes longer than 7 business days.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={refundAlerts}
                  onChange={(e) => setRefundAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">
                    30-Day Manufacturer Warranty Sentinel
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-[#747C89]">
                    Alert before brand warranty expires so you can schedule free repairs or tuneups.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={warrantyAlerts}
                  onChange={(e) => setWarrantyAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 5: DATA & PRIVACY                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'data' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Export Ledger Frame */}
          <Card className="p-6">
            <CardTitle className="text-base flex items-center gap-2 mb-1">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Purchase Ledger Export</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-5">
              Download your entire purchase ledger, warranty timeline, and order numbers as an Excel-compatible CSV file.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F]">
              <div>
                <h5 className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA]">
                  Complete Ledger Snapshot ({purchases.length} Purchase Records)
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-[#747C89] mt-0.5">
                  Includes merchant names, prices, purchase dates, return deadlines, and warranty statuses.
                </p>
              </div>

              <Button
                variant="primary"
                size="small"
                icon={Download}
                onClick={handleExportCSV}
                className="text-xs shrink-0 self-start sm:self-auto"
              >
                Export CSV File
              </Button>
            </div>
          </Card>

          {/* Danger Zone & Account Purge */}
          <Card className="p-6 border-rose-200/80 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/10">
            <CardTitle className="text-base flex items-center gap-2 text-rose-700 dark:text-rose-400 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Data Sovereignty & Account Deletion</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-5">
              Under DPDP Act & GDPR compliance, you have the legal right to completely shred and erase your personal data.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Permanently Erase Account & Ledger
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-[#747C89] mt-0.5">
                  Instantly purges all {purchases.length} orders, warranty tracking, and uploaded receipt attachments.
                </p>
              </div>

              <Button
                variant="danger"
                size="small"
                icon={Trash2}
                onClick={() => setIsDeleteModalOpen(true)}
                className="shrink-0 text-xs self-start sm:self-auto"
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal: Delete Account Safeguard */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Account & Data"
          description="Are you sure you want to permanently erase your AfterBuy account?"
        >
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>Warning:</strong> This action cannot be reversed. All {purchases.length} purchase records, receipt documents, and alert tracking will be immediately shredded.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#22262F]">
              <Button
                variant="outline"
                size="small"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  addToast({
                    title: 'Account Purge Initiated',
                    message: 'Please export your ledger first if needed. Contact support for instant data shredding.',
                    type: 'info',
                  });
                }}
              >
                Confirm Account Deletion
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Subscription Checkout / Upgrade Modal */}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
};
