import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  RotateCcw,
  ShieldCheck,
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  Download,
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { usePurchases } from '../context/PurchaseContext';
import { useToast } from '../components/ui/Toast';
import { formatINR, getReturnInfo, getWarrantyInfo, getLifecycleStatus } from '../utils/purchaseUtils';

export const PurchaseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { purchases, requestReturn, updatePurchase, deletePurchase } = usePurchases();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const purchase = purchases.find((p) => p.id === id) || {
    id,
    name: 'Purchase Record',
    merchant: 'Merchant Store',
    price: 0,
    deliveryDate: 'Delivered',
    returnStatus: 'eligible',
  };

  const [editFormData, setEditFormData] = useState({
    name: purchase.name || '',
    merchant: purchase.merchant || '',
    price: purchase.price || '',
    orderId: purchase.orderId || '',
    category: purchase.category || 'Electronics',
  });

  const returnInfo = getReturnInfo(purchase);
  const warrantyInfo = getWarrantyInfo(purchase);
  const lifecycle = getLifecycleStatus(purchase);

  const handleInitiateReturn = () => {
    requestReturn(purchase.id);
    addToast({
      title: 'Return Initiated',
      message: `Return requested for ${purchase.name}.`,
      type: 'success',
    });
  };

  const handleDownloadInvoice = () => {
    addToast({
      title: 'Invoice Downloaded',
      message: `Tax invoice for ${purchase.name} saved securely.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/app/purchases"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-slate-800 dark:hover:text-[#F5F7FA] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Purchases</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
              {purchase.name}
            </h1>
            <StatusBadge status={lifecycle.badgeStatus} size="medium" />
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
            {purchase.merchant} • {purchase.orderId ? `Order #${purchase.orderId}` : 'Tracked Order'} • Delivered {purchase.deliveryDate}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {purchase.hasReceipt && (
            <Button
              variant="outline"
              size="small"
              icon={Download}
              onClick={handleDownloadInvoice}
            >
              Invoice PDF
            </Button>
          )}
          <Button
            variant="outline"
            size="small"
            icon={Edit2}
            onClick={() => {
              setEditFormData({
                name: purchase.name || '',
                merchant: purchase.merchant || '',
                price: purchase.price || '',
                orderId: purchase.orderId || '',
                category: purchase.category || 'Electronics',
              });
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={Trash2}
            className="text-rose-600 hover:text-rose-700 hover:border-rose-300 dark:hover:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
          {returnInfo.isEligible && (
            <Button
              variant="primary"
              size="small"
              onClick={handleInitiateReturn}
            >
              Request Return
            </Button>
          )}
        </div>
      </div>

      {/* 3 Core Status Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pillar 1: Purchase Overview */}
        <Card className="p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Order Value</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA]">
            ₹{purchase.price ? purchase.price.toLocaleString('en-IN') : 0}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC]">
            Purchased {purchase.purchaseDate || 'Recently'} via {purchase.merchant}
          </div>
        </Card>

        {/* Pillar 2: Return Sentinel */}
        <Card className="p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Return Sentinel</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
            {returnInfo.timeRemainingText || purchase.deadlineText || 'Window Closed'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC]">
            Policy: {purchase.returnWindowDays || 7} Days • Deadline {purchase.returnDeadline || 'N/A'}
          </div>
        </Card>

        {/* Pillar 3: Warranty Coverage */}
        <Card className="p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#A9B0BC]">Warranty Protection</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
            {purchase.warrantyActive ? 'Active Coverage' : 'No Warranty'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC]">
            {purchase.warrantyExpiry ? `Valid until ${purchase.warrantyExpiry}` : 'Standard consumer warranty'}
          </div>
        </Card>
      </div>

      {/* Detailed Timeline & Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardTitle className="text-base">Lifecycle Timeline</CardTitle>
          <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5 mb-6">
            Key milestone dates and reverse logistics states
          </p>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#292E38]">
            <div className="flex items-start gap-3 relative">
              <span className="w-2 h-2 rounded-full bg-blue-600 ring-4 ring-white dark:ring-[#171A21] mt-1 shrink-0 ml-2.5" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA]">
                  Order Delivered
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
                  Package delivered by {purchase.merchant} on {purchase.deliveryDate}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 relative">
              <span className={`w-2 h-2 rounded-full ring-4 ring-white dark:ring-[#171A21] mt-1 shrink-0 ml-2.5 ${returnInfo.isEligible ? 'bg-amber-500' : 'bg-slate-400'}`} />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA]">
                  Return Deadline
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
                  {purchase.returnDeadline} ({purchase.deadlineText || 'Window active'})
                </div>
              </div>
            </div>

            {purchase.warrantyActive && (
              <div className="flex items-start gap-3 relative">
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#171A21] mt-1 shrink-0 ml-2.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    Warranty Valid Until
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
                    {purchase.warrantyExpiry}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <CardTitle className="text-base">Document & Order Metadata</CardTitle>
          <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-0.5 mb-6">
            Identifiers for customer support escalations
          </p>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-[#22262F] text-xs">
            <div className="flex justify-between pt-1">
              <span className="text-slate-500 dark:text-[#A9B0BC]">Item Name</span>
              <span className="font-semibold text-slate-900 dark:text-[#F5F7FA]">{purchase.name}</span>
            </div>
            <div className="flex justify-between pt-2.5">
              <span className="text-slate-500 dark:text-[#A9B0BC]">Merchant</span>
              <span className="font-medium text-slate-900 dark:text-[#F5F7FA]">{purchase.merchant}</span>
            </div>
            <div className="flex justify-between pt-2.5">
              <span className="text-slate-500 dark:text-[#A9B0BC]">Order ID</span>
              <span className="font-mono text-slate-800 dark:text-[#A9B0BC]">{purchase.orderId || 'N/A'}</span>
            </div>
            <div className="flex justify-between pt-2.5">
              <span className="text-slate-500 dark:text-[#A9B0BC]">Category</span>
              <span className="text-slate-800 dark:text-[#A9B0BC]">{purchase.category || 'General'}</span>
            </div>
            <div className="flex justify-between pt-2.5">
              <span className="text-slate-500 dark:text-[#A9B0BC]">Tax Invoice</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {purchase.hasReceipt ? 'Archived in Vault' : 'No document attached'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Purchase Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Purchase Record"
          description={`Update details for ${purchase.name}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updatePurchase(purchase.id, {
                name: editFormData.name,
                merchant: editFormData.merchant,
                price: Number(editFormData.price) || 0,
                orderId: editFormData.orderId,
                category: editFormData.category,
              });
              setIsEditModalOpen(false);
              addToast({
                title: 'Purchase Updated',
                message: `Changes to ${editFormData.name} saved successfully.`,
                type: 'success',
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1">
                  Merchant / Store
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.merchant}
                  onChange={(e) => setEditFormData({ ...editFormData, merchant: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1">
                  Price (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1">
                  Order ID #
                </label>
                <input
                  type="text"
                  value={editFormData.orderId}
                  onChange={(e) => setEditFormData({ ...editFormData, orderId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1">
                  Category
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Gadgets">Gadgets</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#22262F]">
              <Button
                variant="ghost"
                size="small"
                type="button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="small" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Purchase Record"
          description="Are you sure you want to permanently remove this purchase from your vault?"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                You are about to delete <strong>{purchase.name}</strong> (₹{purchase.price?.toLocaleString('en-IN')}). This will remove any associated return deadlines, warranties, and refund tracking for this order.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#22262F]">
              <Button
                variant="ghost"
                size="small"
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Keep Item
              </Button>
              <Button
                variant="danger"
                size="small"
                type="button"
                onClick={() => {
                  deletePurchase(purchase.id);
                  setIsDeleteModalOpen(false);
                  addToast({
                    title: 'Purchase Deleted',
                    message: `${purchase.name} was removed from your ledger.`,
                    type: 'info',
                  });
                  navigate('/app/purchases');
                }}
              >
                Yes, Delete Purchase
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
