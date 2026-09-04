import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui/Toast';

export const SettingsPage = () => {
  const { user, updateUser, initials } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  // Clean, focused industry-standard profile fields for a post-purchase platform:
  const [name, setName] = useState(user?.name || 'Bhuvan');
  const [email, setEmail] = useState(user?.email || 'bhuvan@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [pickupCity, setPickupCity] = useState(user?.city || 'Bengaluru');

  // Notification sentinel thresholds
  const [urgentReminders, setUrgentReminders] = useState(true);
  const [refundAlerts, setRefundAlerts] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      phone,
      city: pickupCity,
    });
    addToast({
      title: 'Profile Updated',
      message: 'Your account and notification preferences have been saved.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
          Account & Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
          Manage your personal details, courier contact information, and alert preferences.
        </p>
      </div>

      {/* 1. Account Profile Card */}
      <Card className="p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-[#22262F]">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-[#232833] text-white dark:text-[#F5F7FA] font-bold text-lg flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                {name}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5">
              {email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 pt-6">
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
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                Notification Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                Phone Number <span className="font-normal text-slate-400">(for reverse courier pickups)</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                Default City
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-3">
            <Button variant="primary" size="small" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* 2. Theme Preferences */}
      <Card className="p-6">
        <CardTitle className="text-base flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Appearance</span>
        </CardTitle>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5 mb-4">
          Select your preferred interface theme
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
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
            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
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
            className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
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

      {/* 3. Alerts & Sentinel Preferences */}
      <Card className="p-6">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Sentinel Alerts</span>
        </CardTitle>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5 mb-4">
          Automated notices for returns and pending merchant refunds
        </p>

        <div className="space-y-3 divide-y divide-slate-100 dark:divide-[#22262F]">
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">
                48-Hour Return Expiry Alert
              </div>
              <div className="text-[11px] text-slate-400">
                Notify before a product's store return window permanently expires.
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
              <div className="text-[11px] text-slate-400">
                Flag returned orders when merchant credit takes longer than 7 business days.
              </div>
            </div>
            <input
              type="checkbox"
              checked={refundAlerts}
              onChange={(e) => setRefundAlerts(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
