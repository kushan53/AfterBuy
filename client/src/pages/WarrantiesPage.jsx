import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  ExternalLink,
  Plus,
  FileText,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { usePurchases } from '../context/PurchaseContext';

export const WarrantiesPage = () => {
  const navigate = useNavigate();
  const { purchases, totalActiveWarranties, expiringWarrantiesList } = usePurchases();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'expiring', 'healthy'

  const allWarranties = purchases.filter((p) => p.warrantyActive);

  const filteredWarranties = allWarranties.filter((w) => {
    if (activeTab === 'expiring') return w.isWarrantyExpiringSoon || (w.warrantyDaysLeft && w.warrantyDaysLeft < 60);
    if (activeTab === 'healthy') return !w.isWarrantyExpiringSoon && (!w.warrantyDaysLeft || w.warrantyDaysLeft >= 60);
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
          Warranty Vault
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
          Store manufacturer serials, coverage certificates, and receive renewal & claim alerts before protection expires.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Active Warranties</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-2">
            {totalActiveWarranties} products
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
            Active manufacturer coverage
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
            {expiringWarrantiesList.length} products
          </div>
          <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
            Coverage ends in under 60 days
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Digital Proofs</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-2">
            {allWarranties.filter(w => w.hasReceipt).length} archived
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
            Tax invoices attached & ready
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
          All Warranties ({allWarranties.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('expiring')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'expiring'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]'
          }`}
        >
          Expiring Soon ({expiringWarrantiesList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('healthy')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'healthy'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-[#A9B0BC] hover:bg-slate-100 dark:hover:bg-[#1C2028]'
          }`}
        >
          Healthy Coverage ({allWarranties.length - expiringWarrantiesList.length})
        </button>
      </div>

      {/* Main Warranties Table */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Warranties Ledger</CardTitle>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5">
              Serial certificates and brand coverage schedules
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredWarranties.length > 0 ? (
            <Table containerClassName="border-0 rounded-none">
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand / Merchant</TableHead>
                  <TableHead>Purchased</TableHead>
                  <TableHead>Coverage Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt / Invoice</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarranties.map((item) => {
                  const isExpiring = item.isWarrantyExpiringSoon || (item.warrantyDaysLeft && item.warrantyDaysLeft < 60);

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          {item.orderId && (
                            <span className="text-[10px] font-mono text-slate-400 dark:text-[#747C89]">
                              Serial/Order: {item.orderId}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-[#A9B0BC]">
                        {item.merchant}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-[#A9B0BC]">
                        {item.deliveryDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 dark:text-[#F5F7FA]">
                            {item.warrantyExpiry || '1 Year Standard'}
                          </span>
                          {item.warrantyDaysLeft && (
                            <span className={`text-[11px] font-semibold ${isExpiring ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                              {item.warrantyDaysLeft} days remaining
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={isExpiring ? 'warranty-expiring' : 'warranty-active'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {item.hasReceipt ? (
                          <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                            <FileText className="w-3.5 h-3.5" />
                            PDF Archived
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Missing</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="small"
                          className="text-xs py-1 px-2.5"
                          onClick={() => navigate('/app/documents')}
                        >
                          View Documents
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-slate-400 dark:text-[#747C89] text-xs">
              No warranty records under this category.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
