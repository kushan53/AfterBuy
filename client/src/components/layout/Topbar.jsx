import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Plus, Command, Sun, Moon, Laptop, Check, User, Settings, LogOut, CheckCircle2, ArrowLeft, Crown, Sparkles } from 'lucide-react';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from '../ui/Dropdown';
import { Button } from '../ui/Button';
import { CommandPalette } from './CommandPalette';
import { UpgradePlanModal } from '../subscription/UpgradePlanModal';
import { useAuth } from '../../context/AuthContext';
import { usePurchases } from '../../context/PurchaseContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../ui/Toast';

export const Topbar = ({ onMenuClick, onQuickAddClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user, initials, logout, isPro } = useAuth();
  const { urgentReturns, overdueRefunds, expiringWarrantiesList } = usePurchases();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Compute real notifications dynamically from the user's active database items
  const activeNotifications = useMemo(() => {
    const list = [];

    // 1. Expiring Return Windows
    urgentReturns.forEach((item) => {
      list.push({
        id: `ret-${item.id}`,
        title: `Return window ${item.deadlineText ? item.deadlineText.toLowerCase() : 'ending soon'}`,
        subtitle: `${item.name} • ${item.merchant}`,
        link: `/app/returns`,
      });
    });

    // 2. Overdue Refunds
    overdueRefunds.forEach((ref) => {
      list.push({
        id: `ref-${ref.purchaseId || ref.id}`,
        title: `Refund overdue`,
        subtitle: `${ref.merchant || 'Store'} • ₹${ref.amount?.toLocaleString('en-IN')} pending`,
        link: `/app/refunds`,
      });
    });

    // 3. Expiring Warranties
    expiringWarrantiesList.forEach((item) => {
      list.push({
        id: `war-${item.id}`,
        title: `Warranty expiring soon`,
        subtitle: `${item.name} • ${item.warrantyDaysLeft} days left`,
        link: `/app/warranties`,
      });
    });

    return list;
  }, [urgentReturns, overdueRefunds, expiringWarrantiesList]);

  const unreadNotifications = activeNotifications.filter(
    (n) => !readNotificationIds.includes(n.id)
  );

  const handleMarkAllAsRead = () => {
    setReadNotificationIds(activeNotifications.map((n) => n.id));
    addToast({
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
      type: 'info',
    });
  };

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Route titles mapping
  const routeTitles = {
    '/app/dashboard': { title: 'Dashboard', context: 'Overview' },
    '/app/purchases': { title: 'Purchases', context: 'Post-Purchase' },
    '/app/returns': { title: 'Returns', context: 'Post-Purchase' },
    '/app/refunds': { title: 'Refunds', context: 'Post-Purchase' },
    '/app/warranties': { title: 'Warranties', context: 'Post-Purchase' },
    '/app/documents': { title: 'Documents', context: 'Post-Purchase' },
    '/app/analytics': { title: 'Analytics', context: 'Insights' },
    '/app/settings': { title: 'Settings', context: 'System' },
  };

  const currentMeta = routeTitles[location.pathname] || { title: 'Overview', context: 'AfterBuy' };

  return (
    <>
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <header className="fixed top-0 left-0 right-0 lg:left-64 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 dark:border-[#22262F] bg-white/95 dark:bg-[#11141A]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        {/* Left side: Hamburger (mobile) + Breadcrumb Context */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden -ml-1 p-2 rounded-lg text-slate-500 dark:text-[#A9B0BC] hover:text-slate-800 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1C2028] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-slate-500 dark:text-[#A9B0BC] hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group"
              title="Back to Homepage"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:-translate-x-0.5 transition-transform shrink-0" />
              <span className="hidden sm:inline">Back to homepage</span>
              <span className="sm:hidden">Home</span>
            </Link>
            <span className="text-slate-300 dark:text-[#292E38]">/</span>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
              {currentMeta.title}
            </h1>
          </div>
        </div>

        {/* Right side: Search trigger, Quick Action, Theme Switcher, Notifications, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search trigger with shortcut badge */}
          <button
            type="button"
            className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-slate-50/70 dark:bg-[#171A21] hover:bg-slate-100/70 dark:hover:bg-[#1C2028] hover:border-slate-300 dark:hover:border-[#383F4D] px-2 sm:px-3 py-1.5 text-xs text-slate-500 dark:text-[#A9B0BC] transition-colors shrink-0 cursor-pointer"
            onClick={() => setSearchOpen(true)}
            aria-label="Search orders"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#747C89]" />
            <span className="hidden md:inline">Search orders, items...</span>
            <span className="md:hidden">Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#11141A] px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-[#747C89]">
              ⌘K
            </kbd>
          </button>

          {/* Quick Action: Add Purchase */}
          <Button
            variant="primary"
            size="small"
            icon={Plus}
            onClick={onQuickAddClick}
            className="shadow-xs text-xs px-2.5 sm:px-3 py-1.5 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Add Purchase</span>
            <span className="sm:hidden">Add</span>
          </Button>

          {/* Appearance Switcher */}
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
            <DropdownItem
              icon={Laptop}
              onClick={() => setTheme('system')}
              className={theme === 'system' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}
            >
              <div className="flex items-center justify-between w-full">
                <span>System</span>
                {theme === 'system' && <Check className="w-3.5 h-3.5" />}
              </div>
            </DropdownItem>
          </Dropdown>

          {/* Notifications Dropdown */}
          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="relative p-2 rounded-lg text-slate-500 dark:text-[#A9B0BC] hover:text-slate-800 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1C2028] transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#11141A]" />
                )}
              </button>
            }
          >
            <DropdownLabel>
              Notifications {unreadNotifications.length > 0 ? `(${unreadNotifications.length} new)` : ''}
            </DropdownLabel>

            {unreadNotifications.length > 0 ? (
              <>
                {unreadNotifications.map((notif) => (
                  <DropdownItem key={notif.id} onClick={() => navigate(notif.link)}>
                    <div className="flex flex-col gap-0.5 text-left py-0.5 max-w-xs">
                      <span className="font-semibold text-slate-800 dark:text-[#F5F7FA] text-xs">
                        {notif.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-[#747C89] truncate">
                        {notif.subtitle}
                      </span>
                    </div>
                  </DropdownItem>
                ))}
                <DropdownSeparator />
                <DropdownItem
                  onClick={handleMarkAllAsRead}
                  className="text-center justify-center text-blue-600 dark:text-blue-400 font-medium text-xs"
                >
                  Mark all as read
                </DropdownItem>
              </>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 dark:text-[#747C89] space-y-1">
                <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                <div className="font-medium text-slate-700 dark:text-[#F5F7FA]">All caught up!</div>
                <p className="text-[11px] text-slate-400 dark:text-[#747C89]">
                  No urgent return deadlines or overdue refunds.
                </p>
              </div>
            )}
          </Dropdown>

          {/* Pro Badge or Upgrade CTA */}
          {isPro ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 via-violet-600/15 to-indigo-600/15 border border-amber-400/40 text-[10px] font-black text-amber-800 dark:text-amber-300 shadow-xs select-none">
              <Crown className="w-3 h-3 fill-amber-500 text-amber-500" />
              PRO
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100/70 transition-all cursor-pointer select-none"
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>Upgrade</span>
            </button>
          )}

          {/* User Profile Dropdown (Industry Standard: Accessible anywhere) */}
          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-[#232833] text-white dark:text-[#F5F7FA] font-medium text-xs select-none hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                aria-label="User profile"
              >
                {initials}
              </button>
            }
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-[#22262F]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA] truncate">
                  {user?.name || 'User'}
                </div>
                {isPro ? (
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-300/60">
                    PRO
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Upgrade →
                  </button>
                )}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-[#747C89] truncate">
                {user?.email || 'user@example.com'}
              </div>
            </div>
            <DropdownItem icon={User} onClick={() => navigate('/app/settings')}>
              Account Profile
            </DropdownItem>
            <DropdownItem icon={Sparkles} onClick={() => navigate('/app/settings')}>
              Plans & Billing
            </DropdownItem>
            <DropdownItem icon={Settings} onClick={() => navigate('/app/settings')}>
              Preferences
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem
              icon={LogOut}
              danger
              onClick={() => {
                logout();
                addToast({
                  title: 'Logged Out',
                  message: 'You have been logged out successfully.',
                  type: 'info',
                });
                navigate('/', { replace: true });
              }}
            >
              Log out
            </DropdownItem>
          </Dropdown>
        </div>
      </header>

      {/* Upgrade Plan Modal Triggered from Topbar */}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
};
