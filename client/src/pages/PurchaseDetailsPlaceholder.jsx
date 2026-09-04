import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, ShieldCheck, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { usePurchases } from '../context/PurchaseContext';
import { formatINR, getReturnInfo, getWarrantyInfo, getLifecycleStatus } from '../utils/purchaseUtils';

export const PurchaseDetailsPlaceholder = () => {
  const { id } = useParams();
  const { purchases } = usePurchases();

  const purchase = purchases.find((p) => p.id === id) || {
    id,
    name: 'Purchase Record',
    merchant: 'Merchant Store',
    price: 0,
    deliveryDate: 'Delivered',
  };

  const returnInfo = getReturnInfo(purchase);
  const warrantyInfo = getWarrantyInfo(purchase);
  const lifecycle = getLifecycleStatus(purchase);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          to="/app/purchases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-slate-800 dark:hover:text-[#F5F7FA] transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Purchases</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
              {purchase.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
              {purchase.merchant} • {purchase.orderId ? `Order #${purchase.orderId}` : 'Tracked Order'}
            </p>
          </div>
          <StatusBadge status={lifecycle.badgeStatus} size="medium" />
        </div>
      </div>

      <Card className="p-8 text-center border-dashed">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <Package className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-[#F5F7FA]">
          Purchase Details Navigation Route Ready
        </h3>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] max-w-md mx-auto mt-1 leading-relaxed">
          This placeholder establishes the established navigation endpoint for <code className="text-slate-700 dark:text-[#F5F7FA] bg-slate-100 dark:bg-[#1C2028] px-1 py-0.5 rounded font-mono">/app/purchases/{id}</code>. We will design this full page in subsequent steps according to the roadmap.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link to="/app/purchases">
            <Button variant="outline" size="small">
              ← Return to Purchases
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
