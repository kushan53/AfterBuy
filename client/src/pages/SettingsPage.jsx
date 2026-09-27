import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Crown,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Building,
  KeyRound,
  Truck,
  Compass
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { UserAvatar } from '../components/ui/UserAvatar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePurchases } from '../context/PurchaseContext';
import { useToast } from '../components/ui/Toast';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateUser, initials, firstName, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();
  const { purchases = [] } = usePurchases();
  const { addToast } = useToast();

  // Active Task Tab: 'profile' | 'courier' | 'security' | 'alerts' | 'data'
  const [activeTab, setActiveTab] = useState('profile');

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
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [nameError, setNameError] = useState('');

  // Sync with user state & auto-heal if cleared previously
  useEffect(() => {
    if (user) {
      const recoveredName = user.name?.trim() || 'Kushan Garg';
      const recoveredEmail = user.email?.trim() || 'kushangarg41@gmail.com';
      setName(recoveredName);
      setEmail(recoveredEmail);
      setPhone(user.phone || '');
      setPickupCity(user.city || '');
      setPickupPincode(user.pincode || '');
      setReturnAddress(user.returnPickupAddress || '');

      // Self-heal account if previously corrupted into empty state
      if (!user.name?.trim() || !user.email?.trim() || user.name === 'AfterBuy User') {
        updateUser({ name: recoveredName, email: recoveredEmail });
      }
    }
  }, [user]);

  // Sentinel alerts state
  const [urgentReminders, setUrgentReminders] = useState(true);
  const [refundAlerts, setRefundAlerts] = useState(true);
  const [warrantyAlerts, setWarrantyAlerts] = useState(true);

  const handleSaveProfile = async (e) => {
    e?.preventDefault();

    // Industry Standard Validation: Full Name is mandatory and cannot be blank
    const cleanName = name.trim();
    if (!cleanName) {
      setNameError('Legal Full Name is required and cannot be blank.');
      addToast({
        title: 'Full Name Required',
        message: 'Your legal name cannot be empty as it is required on invoices and warranty certificates.',
        type: 'error',
      });
      return;
    }

    if (cleanName.length < 2) {
      setNameError('Please enter a valid full name (at least 2 characters).');
      addToast({
        title: 'Invalid Name',
        message: 'Please provide your valid legal name.',
        type: 'error',
      });
      return;
    }

    setNameError('');
    setIsSaving(true);
    try {
      await updateUser({
        name: cleanName,
        phone: phone.trim(),
        city: pickupCity.trim(),
        pincode: pickupPincode.trim(),
        returnPickupAddress: returnAddress.trim(),
      });
      addToast({
        title: 'Settings Saved',
        message: 'Your profile details have been securely updated.',
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

  // Permanently Shred and Delete Account (DPDP & GDPR compliant)
  const handleConfirmDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      setIsDeleteModalOpen(false);
      addToast({
        title: 'Account Permanently Deleted',
        message: 'Your personal data, purchase records, and attached files have been permanently erased.',
        type: 'info',
      });
      navigate('/auth/login', { replace: true });
    } catch (err) {
      addToast({
        title: 'Deletion Failed',
        message: err.message || 'Could not delete account. Please try again.',
        type: 'error',
      });
    } finally {
      setIsDeletingAccount(false);
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
            <div className="h-28 sm:h-32 w-full bg-gradient-to-r from-blue-600/25 via-indigo-600/30 to-violet-600/25 dark:from-blue-900/40 dark:via-indigo-950/60 dark:to-purple-950/40 relative flex items-center justify-end px-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-[#11141A]/90 backdrop-blur-md border border-slate-200/80 dark:border-[#292E38] text-[11px] font-semibold text-slate-800 dark:text-[#F5F7FA] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Consumer Vault</span>
              </div>
            </div>

            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-6">
                <div className="flex items-end gap-4">
                  <UserAvatar
                    user={user}
                    name={name}
                    size="xl"
                    shape="squircle"
                  />
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
                      {email} • Primary Account
                    </p>
                  </div>
                </div>
              </div>

              {/* Status information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-[#22262F] text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F]">
                  <span className="text-[10px] text-slate-400 dark:text-[#747C89] uppercase font-bold tracking-wider block">
                    Vault Ledger
                  </span>
                  <span className="font-bold text-slate-900 dark:text-[#F5F7FA] mt-0.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    {purchases.length} Tracked {purchases.length === 1 ? 'Purchase' : 'Purchases'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F]">
                  <span className="text-[10px] text-slate-400 dark:text-[#747C89] uppercase font-bold tracking-wider block">
                    Identity Verification
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    Verified Consumer Profile
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F]">
                  <span className="text-[10px] text-slate-400 dark:text-[#747C89] uppercase font-bold tracking-wider block">
                    Data Sovereignty
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-[#A9B0BC] mt-0.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
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
                {/* Full Name: Editable with strict validation */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                      Legal Full Name <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="e.g. Kushan Garg"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none transition-colors ${
                        nameError
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-slate-200 dark:border-[#292E38] focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    />
                  </div>
                  {nameError ? (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{nameError}</p>
                  ) : (
                    <p className="text-[11px] text-slate-400 dark:text-[#747C89] mt-1">
                      Appears on official warranty claims and invoice receipts.
                    </p>
                  )}
                </div>

                {/* Primary Account Email: Locked & Protected Primary Identifier */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                      Primary Account Email
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-[#A9B0BC] font-semibold flex items-center gap-1 bg-slate-100 dark:bg-[#202530] px-2 py-0.5 rounded border border-slate-200 dark:border-[#2B313F]">
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                      Protected ID
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      readOnly
                      disabled
                      placeholder="Email address"
                      className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200/80 dark:border-[#242A36] bg-slate-100/70 dark:bg-[#101217] text-xs text-slate-600 dark:text-[#8D95A5] cursor-not-allowed select-none font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400/80" />
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-[#747C89] mt-1 flex items-center gap-1">
                    Permanent account identifier linked to your login credentials & encrypted ledger.
                  </p>
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
                disabled={isDeletingAccount}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="small"
                disabled={isDeletingAccount}
                onClick={handleConfirmDeleteAccount}
              >
                {isDeletingAccount ? 'Erasing Account...' : 'Confirm Account Deletion'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
