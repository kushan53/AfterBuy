import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BadgePercent,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { usePurchases } from '../context/PurchaseContext';

export const RefundsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    purchases,
    pendingRefundsList,
    settledRefundsList,
    totalPendingRefundAmount,
    totalRefundedAmount,
    overdueRefunds,
    markRefundReceived,
  } = usePurchases();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'overdue', 'pending', 'settled'
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);

  // Filter refunds
  const allRefunds = [
    ...pendingRefundsList,
    ...settledRefundsList
  ];

  const filteredRefunds = allRefunds.filter((ref) => {
    if (activeTab === 'overdue') return ref.isOverdue && !ref.settled;
    if (activeTab === 'pending') return !ref.settled && !ref.isOverdue;
    if (activeTab === 'settled') return ref.settled || ref.status === 'refund-received';
    return true;
  });

  const handleSettleRefund = (refund) => {
    markRefundReceived(refund.id);
    setIsSettleModalOpen(false);
    addToast({
      title: 'Refund Settled',
      message: `₹${refund.amount.toLocaleString('en-IN')} marked as received in your bank account!`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
            Refunds Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
            Track merchant refund turnarounds, highlight overdue credits, and verify your bank deposits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/app/returns">
            <Button variant="outline" size="small">
              View Returns Sentinel
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Pending Refunds</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-2">
            ₹{totalPendingRefundAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
            {pendingRefundsList.length} orders awaiting merchant credit
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">Overdue Refunds</span>
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-2">
            {overdueRefunds.length} overdue
          </div>
          <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
            Past promised turnaround window
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Total Recovered</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{totalRefundedAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
            {settledRefundsList.length} refunds safely deposited
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-[#22262F] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]'
          }`}
        >
          All Refunds ({allRefunds.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('overdue')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'overdue'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]'
          }`}
        >
          Overdue ({overdueRefunds.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]'
          }`}
        >
          In Progress ({pendingRefundsList.filter(r => !r.isOverdue).length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settled')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'settled'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]'
          }`}
        >
          Settled / Received ({settledRefundsList.length})
        </button>
      </div>

      {/* Main Refunds Table */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Refunds Ledger</CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5">
              Live status and merchant turnaround tracking
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredRefunds.length > 0 ? (
            <Table containerClassName="border-0 rounded-none">
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHead>Product</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason / Notes</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRefunds.map((ref) => {
                  const isSettled = ref.settled || ref.status === 'refund-received';
                  const isOverdue = ref.isOverdue && !isSettled;

                  return (
                    <TableRow key={ref.id || ref.purchaseId}>
                      <TableCell className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                        {ref.name}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-[#A9B0BC]">
                        {ref.merchant}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 dark:text-[#F5F7FA]">
                        ₹{ref.amount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-[#A9B0BC]">
                        {ref.expectedDate || 'Within 5-7 days'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={
                            isSettled
                              ? 'refund-received'
                              : isOverdue
                              ? 'refund-overdue'
                              : 'refund-pending'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 dark:text-[#A9B0BC]">
                        {ref.reason || 'Standard merchant return credit'}
                      </TableCell>
                      <TableCell className="text-right">
                        {isSettled ? (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Deposited
                          </span>
                        ) : (
                          <Button
                            variant={isOverdue ? 'primary' : 'outline'}
                            size="small"
                            className="text-xs py-1 px-2.5"
                            onClick={() => {
                              setSelectedRefund(ref);
                              setIsSettleModalOpen(true);
                            }}
                          >
                            Mark Received
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-slate-400 dark:text-[#747C89] text-xs">
              No refunds found under this category.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settle Refund Confirmation Modal */}
      {selectedRefund && (
        <Modal
          isOpen={isSettleModalOpen}
          onClose={() => setIsSettleModalOpen(false)}
          title="Confirm Refund Received"
          description={`Confirm deposit of ₹${selectedRefund.amount.toLocaleString('en-IN')} for ${selectedRefund.name}`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-[#A9B0BC]">Order</span>
                <span className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                  {selectedRefund.name}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-[#A9B0BC]">Merchant</span>
                <span className="font-medium text-slate-800 dark:text-[#F5F7FA]">
                  {selectedRefund.merchant}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-[#A9B0BC]">Refund Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  ₹{selectedRefund.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              Confirming this refund moves it to your <strong>Total Recovered</strong> ledger and closes the pending dispute notice.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#22262F]">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsSettleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => handleSettleRefund(selectedRefund)}
              >
                Confirm Received
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
