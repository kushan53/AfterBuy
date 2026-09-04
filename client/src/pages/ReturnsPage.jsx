import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  RotateCcw,
  AlertTriangle,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { usePurchases } from '../context/PurchaseContext';

export const ReturnsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    purchases,
    approachingReturnItems,
    urgentReturns,
    requestReturn,
  } = usePurchases();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'eligible', 'requested', 'in_transit'
  const [selectedReturnItem, setSelectedReturnItem] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // Return items in different stages
  const inProgressReturns = purchases.filter(
    (p) => p.returnStatus === 'return_requested' || p.returnStatus === 'picked_up' || p.returnStatus === 'in_transit'
  );

  const eligibleReturns = approachingReturnItems;

  const filteredItems = purchases.filter((item) => {
    if (activeTab === 'eligible') {
      return item.returnStatus === 'eligible' || item.returnStatus === 'expiring';
    }
    if (activeTab === 'requested') {
      return item.returnStatus === 'return_requested';
    }
    if (activeTab === 'in_transit') {
      return item.returnStatus === 'picked_up' || item.returnStatus === 'in_transit';
    }
    // 'all' includes anything active or approaching
    return (
      item.returnStatus === 'eligible' ||
      item.returnStatus === 'expiring' ||
      item.returnStatus === 'return_requested' ||
      item.returnStatus === 'picked_up' ||
      item.returnStatus === 'in_transit'
    );
  });

  const handleInitiateReturn = (item) => {
    requestReturn(item.id);
    setIsReturnModalOpen(false);
    addToast({
      title: 'Return Initiated',
      message: `Return requested for ${item.name}. Status updated and reverse pickup scheduled.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
          Returns Sentinel
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
          Track policy windows, initiate returns before deadlines expire, and monitor courier pickups.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Active Windows</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-2">
            {eligibleReturns.length} items
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
            Eligible for merchant return
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">Expiring Soon</span>
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-2">
            {urgentReturns.length} urgent
          </div>
          <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
            Deadline ends within 48 hours
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">In Return Transit</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-2">
            {inProgressReturns.length} packages
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
            Courier pickups & shipments
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
          All Returns ({purchases.filter(p => p.returnStatus && p.returnStatus !== 'expired').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('eligible')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'eligible'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]'
          }`}
        >
          Active Windows ({eligibleReturns.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('requested')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'requested'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]'
          }`}
        >
          Pickup Requested ({purchases.filter(p => p.returnStatus === 'return_requested').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('in_transit')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'in_transit'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]'
          }`}
        >
          Picked Up / In Transit ({purchases.filter(p => p.returnStatus === 'picked_up' || p.returnStatus === 'in_transit').length})
        </button>
      </div>

      {/* Main Returns Table / Card view */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Returns Ledger</CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5">
              Showing items matching {activeTab.replace('_', ' ')} filter
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredItems.length > 0 ? (
            <Table containerClassName="border-0 rounded-none">
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHead>Product</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Return Status</TableHead>
                  <TableHead>Window / Courier</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const isEligible = item.returnStatus === 'eligible' || item.returnStatus === 'expiring';
                  const isRequested = item.returnStatus === 'return_requested';
                  const isPickedUp = item.returnStatus === 'picked_up';

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          {item.orderId && (
                            <span className="text-[10px] font-mono text-slate-400 dark:text-[#747C89]">
                              {item.orderId}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-[#A9B0BC]">
                        {item.merchant}
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-[#F5F7FA]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-[#A9B0BC]">
                        {item.deliveryDate}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={
                            item.returnStatus === 'expiring'
                              ? 'return-expiring'
                              : item.returnStatus === 'eligible'
                              ? 'return-eligible'
                              : item.returnStatus === 'return_requested'
                              ? 'return-requested'
                              : item.returnStatus === 'picked_up'
                              ? 'refund-overdue'
                              : 'return-eligible'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {isEligible ? (
                          <span
                            className={`font-semibold ${
                              item.isUrgentReturn || item.returnStatus === 'expiring'
                                ? 'text-amber-700 dark:text-amber-300'
                                : 'text-slate-600 dark:text-[#A9B0BC]'
                            }`}
                          >
                            {item.deadlineText}
                          </span>
                        ) : isRequested ? (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Pickup Scheduled
                          </span>
                        ) : isPickedUp ? (
                          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            Courier in Transit
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Closed</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEligible ? (
                          <Button
                            variant={item.isUrgentReturn || item.returnStatus === 'expiring' ? 'primary' : 'outline'}
                            size="small"
                            className="text-xs py-1 px-2.5"
                            onClick={() => {
                              setSelectedReturnItem(item);
                              setIsReturnModalOpen(true);
                            }}
                          >
                            Request Return
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="small"
                            className="text-xs py-1 px-2.5 text-blue-600 dark:text-blue-400"
                            onClick={() => navigate('/app/refunds')}
                          >
                            Track Refund →
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
              No returns found under this filter.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return Request Confirmation Modal */}
      {selectedReturnItem && (
        <Modal
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          title="Initiate Return Request"
          description={`Lock in your return window for ${selectedReturnItem.name}`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/80 dark:border-[#22262F] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-[#A9B0BC]">Product</span>
                <span className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                  {selectedReturnItem.name}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-[#A9B0BC]">Merchant</span>
                <span className="font-medium text-slate-800 dark:text-[#F5F7FA]">
                  {selectedReturnItem.merchant}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-[#A9B0BC]">Refund Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{selectedReturnItem.price.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-[#A9B0BC]">Window Expiry</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {selectedReturnItem.deadlineText} ({selectedReturnItem.returnDeadline})
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#A9B0BC] leading-relaxed">
              Clicking <strong>Confirm Return</strong> updates your personal ledger status to <em>Return Requested</em> and automatically registers an expected refund of ₹{selectedReturnItem.price.toLocaleString('en-IN')} into your Refund Tracker.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#22262F]">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsReturnModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => handleInitiateReturn(selectedReturnItem)}
              >
                Confirm Return
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
