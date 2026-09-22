import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0F1115] text-slate-900 dark:text-[#F5F7FA] flex transition-colors duration-200">
      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Workspace Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden lg:pl-64">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          onQuickAddClick={() => navigate('/app/purchases/new')}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-3 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-[5.5rem] lg:px-8 lg:pb-10 lg:pt-24 max-w-7xl w-full mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
