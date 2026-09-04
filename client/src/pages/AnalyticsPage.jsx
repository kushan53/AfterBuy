import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { usePurchases } from '../context/PurchaseContext';

export const AnalyticsPage = () => {
  const {
    purchases,
    totalRefundedAmount,
    totalPendingRefundAmount,
    totalActiveWarranties,
  } = usePurchases();

  const totalSpent = purchases.reduce((acc, p) => acc + (p.price || 0), 0);
  const totalItemsCount = purchases.length;
  const returnedOrRefundedCount = purchases.filter(
    (p) => p.returnStatus === 'return_requested' || p.returnStatus === 'picked_up' || p.refund
  ).length;

  const returnRate = totalItemsCount > 0 ? ((returnedOrRefundedCount / totalItemsCount) * 100).toFixed(1) : 0;

  // Merchant spending breakdown
  const merchantStats = purchases.reduce((acc, p) => {
    const m = p.merchant || 'Other';
    acc[m] = (acc[m] || 0) + p.price;
    return acc;
  }, {});

  const sortedMerchants = Object.entries(merchantStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
          Spend & Post-Purchase Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
          Household purchase trends, refund recovery performance, and return rate metrics.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4.5">
          <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Total Tracked Purchases</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-2">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across {totalItemsCount} total orders</span>
        </Card>

        <Card className="p-4.5">
          <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Recovered Refunds</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{totalRefundedAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">Protected capital saved</span>
        </Card>

        <Card className="p-4.5">
          <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Overall Return Rate</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-2">
            {returnRate}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">{returnedOrRefundedCount} items returned/refunded</span>
        </Card>

        <Card className="p-4.5">
          <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Active Warranty Coverage</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {totalActiveWarranties} items
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Protected under manufacturer care</span>
        </Card>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Merchants by Spend */}
        <Card className="p-6">
          <CardTitle className="text-base">Top Stores by Spend</CardTitle>
          <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5 mb-6">
            Where your household shopping expenditure is concentrated
          </p>
          <div className="space-y-4">
            {sortedMerchants.map(([store, amount]) => {
              const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
              return (
                <div key={store} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 dark:text-[#F5F7FA]">{store}</span>
                    <span className="text-slate-600 dark:text-[#A9B0BC]">
                      ₹{amount.toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-[#1C2028] overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Protection Health Matrix */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <CardTitle className="text-base">Protection Health Score</CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5 mb-6">
              Evaluation of your return deadlines, warranties, and receipt archives
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-100 dark:border-[#22262F]">
                <div className="text-xs text-slate-400">Vault Completeness</div>
                <div className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">92%</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">High invoice coverage</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-100 dark:border-[#22262F]">
                <div className="text-xs text-slate-400">Claim Success Rate</div>
                <div className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">100%</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Zero missed deadlines</div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              AfterBuy has protected <strong>₹{totalRefundedAmount.toLocaleString('en-IN')}</strong> from slipping away into forgotten store deadlines.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
