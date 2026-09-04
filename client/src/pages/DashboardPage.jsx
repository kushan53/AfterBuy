import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BadgePercent,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { usePurchases } from '../context/PurchaseContext';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { firstName } = useAuth();
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Single Source of Truth from PurchaseContext
  const {
    approachingReturnItems,
    pendingRefundsList,
    expiringWarrantiesList,
    totalActiveWarranties,
    urgentReturns,
    overdueRefunds,
    urgentCount,
    totalPendingRefundAmount,
    totalRefundedAmount,
    requestReturn,
    markRefundReceived,
  } = usePurchases();

  // Handle Request Return interaction
  const handleRequestReturn = (item) => {
    requestReturn(item.id);
    addToast({
      title: 'Return Initiated',
      message: `Return requested for ${item.name}. Status updated and moved to Returns tracker.`,
      type: 'success',
    });
  };

  // Handle Mark Received / Settle interaction
  const handleMarkReceived = (ref) => {
    markRefundReceived(ref.id);
    addToast({
      title: 'Refund Settled',
      message: `${ref.name} refund of ₹${ref.amount.toLocaleString('en-IN')} marked as received in your account.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header / Greeting Context */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
          Good morning, {firstName}
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
          Here's what requires your attention today across your purchases.
        </p>
      </div>

      {/* 2. ACTION REQUIRED — Fully Data-Driven Hero Banner */}
      {urgentCount > 0 ? (
        <div className="rounded-xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/25 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-200/60 dark:bg-amber-900/50 px-2 py-0.5 rounded">
                    Action Required
                  </span>
                  <span className="text-xs font-semibold text-amber-950 dark:text-amber-100">
                    {urgentCount} {urgentCount === 1 ? 'item needs' : 'items need'} your attention
                  </span>
                </div>
                <ul className="text-xs text-amber-900/90 dark:text-amber-200/90 space-y-0.5 pt-0.5">
                  {urgentReturns.map((item) => (
                    <li key={item.id} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">{item.name}</strong> — return deadline {item.deadlineText.toLowerCase()}
                      </span>
                    </li>
                  ))}
                  {overdueRefunds.map((ref) => (
                    <li key={ref.id} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">{ref.name}</strong> — refund ₹{ref.amount.toLocaleString('en-IN')} overdue
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <Button
                variant="primary"
                size="small"
                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 text-white shadow-xs"
                onClick={() => setIsActionModalOpen(true)}
              >
                View actions →
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>All clear! Nothing needs your attention right now.</span>
          </div>
          <Link to="/app/purchases">
            <Button variant="ghost" size="small" className="text-emerald-800 dark:text-emerald-300">
              View Purchases →
            </Button>
          </Link>
        </div>
      )}

      {/* 3. SUMMARY CARDS — All Derived From Mock Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Refunds"
          value={`₹${totalPendingRefundAmount.toLocaleString('en-IN')}`}
          supportingText={`${pendingRefundsList.length} ${pendingRefundsList.length === 1 ? 'order' : 'orders'}`}
          icon={BadgePercent}
          onClick={() => navigate('/app/refunds')}
        />
        <StatCard
          label="Active Return Windows"
          value={`${approachingReturnItems.length} items`}
          supportingText={
            approachingReturnItems.some((i) => i.deadlineText === 'Tomorrow')
              ? 'Earliest ends tomorrow'
              : 'All within window'
          }
          icon={RotateCcw}
          onClick={() => navigate('/app/returns')}
        />
        <StatCard
          label="Active Warranties"
          value={`${totalActiveWarranties} items`}
          supportingText={`${expiringWarrantiesList.length} expiring soon`}
          icon={ShieldCheck}
          onClick={() => navigate('/app/warranties')}
        />
        <StatCard
          label="Total Refunded"
          value={`₹${totalRefundedAmount.toLocaleString('en-IN')}`}
          supportingText="All-time refunds"
          icon={TrendingUp}
          onClick={() => navigate('/app/refunds')}
        />
      </div>

      {/* 4. MAIN LAYOUT: Main Content (Deadlines & Refunds) + Right Sidebar (Warranties & Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Priority Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION: Approaching Return Deadlines */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Approaching Return Deadlines</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Items currently within their active return window.
                </p>
              </div>
              <Link to="/app/returns" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View all returns →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {approachingReturnItems.length > 0 ? (
                <Table containerClassName="border-0 rounded-none">
                  <TableHeader>
                    <TableRow hoverable={false}>
                      <TableHead>Product</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Delivered</TableHead>
                      <TableHead>Return Status</TableHead>
                      <TableHead>Time Remaining</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approachingReturnItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-semibold text-slate-900">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-slate-600">{item.merchant}</TableCell>
                        <TableCell className="font-medium text-slate-900">
                          ₹{item.price.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-slate-500">{item.deliveryDate}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={
                              item.returnStatus === 'expiring'
                                ? 'return-expiring'
                                : 'return-eligible'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${
                              item.isUrgentReturn || item.returnStatus === 'expiring'
                                ? 'text-amber-700 font-semibold'
                                : 'text-slate-600'
                            }`}
                          >
                            {item.deadlineText}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.isUrgentReturn || item.returnStatus === 'expiring' ? (
                            <Button
                              variant="primary"
                              size="small"
                              className="text-xs py-1 px-2.5"
                              onClick={() => handleRequestReturn(item)}
                            >
                              Request Return
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="small"
                              className="text-xs py-1 px-2.5"
                              onClick={() => navigate('/app/purchases')}
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active return windows approaching deadline.
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION: Pending & In-Flight Refunds */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Pending & In-Flight Refunds</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Money awaiting credit back to your account.
                </p>
              </div>
              <Link to="/app/refunds" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View all refunds →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {pendingRefundsList.length > 0 ? (
                <Table containerClassName="border-0 rounded-none">
                  <TableHeader>
                    <TableRow hoverable={false}>
                      <TableHead>Product</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Expected Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRefundsList.map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell className="font-semibold text-slate-900">
                          {ref.name}
                        </TableCell>
                        <TableCell className="text-slate-600">{ref.merchant}</TableCell>
                        <TableCell className="font-bold text-slate-900">
                          ₹{ref.amount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              ref.isOverdue && !ref.settled
                                ? 'text-rose-600 font-semibold'
                                : 'text-slate-600'
                            }
                          >
                            {ref.expectedDate} {ref.isOverdue && !ref.settled && '(Overdue)'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={ref.status} size="small" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="small"
                            className="text-xs py-1 px-2.5"
                            onClick={() => handleMarkReceived(ref)}
                          >
                            Mark Received
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No pending refunds awaiting settlement.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Warranties Expiring Soon + Data-Driven Smart Insight */}
        <div className="space-y-6">
          {/* SECTION: Warranties Expiring Soon */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Warranties Expiring Soon</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Top items nearing warranty end.</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {expiringWarrantiesList.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <h5 className="font-semibold text-slate-900 text-xs">{item.name}</h5>
                    <span
                      className={`text-[11px] font-medium ${
                        item.warrantyDaysLeft <= 30 ? 'text-amber-700' : 'text-slate-500'
                      }`}
                    >
                      {item.warrantyDaysLeft <= 30
                        ? `Expires in ${item.warrantyDaysLeft} days`
                        : `Expires ${item.warrantyExpiry}`}
                    </span>
                  </div>
                  <StatusBadge
                    status={item.warrantyDaysLeft <= 30 ? 'warranty-expiring' : 'warranty-active'}
                    size="small"
                  />
                </div>
              ))}

              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/app/warranties"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  View all warranties →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* SECTION: Secondary Smart Insight Card — Derived Dynamically */}
          <Card className="p-5 border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-[#F5F7FA]">Smart Insight</h4>
            </div>
            {totalPendingRefundAmount > 0 ? (
              <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
                You have <strong className="text-slate-900 dark:text-[#F5F7FA]">₹{totalPendingRefundAmount.toLocaleString('en-IN')}</strong> currently tied up in pending refunds.
              </p>
            ) : (
              <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
                All refunds have been settled in your account.
              </p>
            )}
            {approachingReturnItems.length > 0 ? (
              <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed mt-2">
                <strong className="text-slate-900 dark:text-[#F5F7FA]">
                  {approachingReturnItems.length} return {approachingReturnItems.length === 1 ? 'deadline is' : 'deadlines are'}
                </strong> approaching this week.
              </p>
            ) : (
              <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed mt-2">
                No purchases currently inside return windows.
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Action Required Modal (Revealed via 'View actions →' CTA) */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title="Immediate Actions Required"
        description="Take action on your pending deadlines and overdue refund."
      >
        <div className="space-y-4">
          {urgentReturns.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-200 bg-amber-200/70 dark:bg-amber-900/50 px-1.5 py-0.5 rounded">
                  Return Deadline
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">{item.name}</h4>
                <p className="text-[11px] text-slate-600 dark:text-[#A9B0BC]">
                  {item.merchant} • ₹{item.price.toLocaleString('en-IN')} • Deadline ends {item.deadlineText.toLowerCase()}.
                </p>
              </div>
              <Button
                variant="primary"
                size="small"
                className="w-full sm:w-auto shrink-0"
                onClick={() => {
                  handleRequestReturn(item);
                  setIsActionModalOpen(false);
                }}
              >
                Request Return
              </Button>
            </div>
          ))}

          {overdueRefunds.map((ref) => (
            <div
              key={ref.id}
              className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-200 bg-rose-200/70 dark:bg-rose-900/50 px-1.5 py-0.5 rounded">
                  Overdue Refund
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">{ref.name}</h4>
                <p className="text-[11px] text-slate-600 dark:text-[#A9B0BC]">
                  {ref.merchant} • ₹{ref.amount.toLocaleString('en-IN')} was expected by {ref.expectedDate}.
                </p>
              </div>
              <Button
                variant="outline"
                size="small"
                className="w-full sm:w-auto shrink-0 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100/50 dark:hover:bg-rose-950/50"
                onClick={() => {
                  handleMarkReceived(ref);
                  setIsActionModalOpen(false);
                }}
              >
                Mark Received
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-slate-100 dark:border-[#22262F]">
          <Button variant="outline" size="small" onClick={() => setIsActionModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};
