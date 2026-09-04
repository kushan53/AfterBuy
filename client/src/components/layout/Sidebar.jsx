import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  RotateCcw,
  BadgePercent,
  ShieldCheck,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronsUpDown,
  X,
  Sparkles
} from 'lucide-react';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from '../ui/Dropdown';
import { usePurchases } from '../../context/PurchaseContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { cn } from '../../utils/cn';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user, initials, logout } = useAuth();
  const {
    purchases,
    activeReturnsCount,
    pendingRefundsList,
    totalActiveWarranties,
    urgentReturns,
    overdueRefunds,
  } = usePurchases();

  const navigationGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'POST-PURCHASE',
      items: [
        {
          name: 'Purchases',
          to: '/app/purchases',
          icon: ShoppingBag,
          badge: purchases.length > 0 ? `${purchases.length}` : null,
        },
        {
          name: 'Returns',
          to: '/app/returns',
          icon: RotateCcw,
          badge: activeReturnsCount > 0 ? `${activeReturnsCount}` : null,
          badgeAlert: urgentReturns.length > 0,
        },
        {
          name: 'Refunds',
          to: '/app/refunds',
          icon: BadgePercent,
          badge: pendingRefundsList.length > 0 ? `${pendingRefundsList.length}` : null,
          badgeOverdue: overdueRefunds.length > 0,
        },
        {
          name: 'Warranties',
          to: '/app/warranties',
          icon: ShieldCheck,
          badge: totalActiveWarranties > 0 ? `${totalActiveWarranties}` : null,
        },
        { name: 'Documents', to: '/app/documents', icon: FileText },
      ],
    },
    {
      title: 'INSIGHTS',
      items: [
        { name: 'Analytics', to: '/app/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Settings', to: '/app/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-[#11141A] border-r border-slate-200/80 dark:border-[#22262F] transition-colors duration-200">
      {/* Top section: Logo */}
      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-[#22262F]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-xs tracking-wider">
              AB
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
                AFTERBUY
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#747C89] font-medium tracking-tight">
                Post-purchase OS
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1C2028]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-6 px-3.5 py-5 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-[#747C89] uppercase select-none">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen && setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-150",
                          isActive
                            ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold shadow-xs"
                            : "text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-50 dark:hover:bg-[#171A21] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={cn(
                                "w-4 h-4 shrink-0 transition-colors",
                                isActive
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-slate-400 dark:text-[#747C89] group-hover:text-slate-600 dark:group-hover:text-[#A9B0BC]"
                              )}
                            />
                            <span className="truncate">{item.name}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={cn(
                                "ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-none tracking-tight",
                                item.badgeOverdue
                                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                                  : item.badgeAlert
                                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                                  : isActive
                                  ? "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                                  : "bg-slate-100 dark:bg-[#1C2028] text-slate-500 dark:text-[#A9B0BC]"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="relative z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
