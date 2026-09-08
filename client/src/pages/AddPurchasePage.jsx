import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Package,
  RotateCcw,
  ShieldCheck,
  FileText,
  Upload,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { usePurchases } from '../context/PurchaseContext';
import { useToast } from '../components/ui/Toast';

export const AddPurchasePage = () => {
  const navigate = useNavigate();
  const { addPurchase } = usePurchases();
  const { addToast } = useToast();

  // SECTION 1: Basic Details
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [merchant, setMerchant] = useState('Amazon');
  const [orderId, setOrderId] = useState('');
  const [category, setCategory] = useState('Electronics');

  // SECTION 2: Delivery
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // SECTION 3: Return Window
  const [hasReturnWindow, setHasReturnWindow] = useState('yes');
  const [returnWindowOption, setReturnWindowOption] = useState('7');
  const [customReturnDeadline, setCustomReturnDeadline] = useState('');

  // SECTION 4: Warranty
  const [hasWarranty, setHasWarranty] = useState('yes');
  const [warrantyOption, setWarrantyOption] = useState('1yr');
  const [customWarrantyExpiry, setCustomWarrantyExpiry] = useState('');

  // Mock Document Upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});

  // Calculate intelligent return deadline preview
  const calculatedReturnDeadline = (() => {
    if (hasReturnWindow === 'no' || returnWindowOption === '0') return 'No Return';
    if (returnWindowOption === 'custom') return customReturnDeadline || 'Custom Date';

    const baseDate = new Date(deliveryDate || purchaseDate);
    const days = parseInt(returnWindowOption, 10) || 7;
    baseDate.setDate(baseDate.getDate() + days);
    return baseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  })();

  // Calculate intelligent warranty expiry preview
  const calculatedWarrantyExpiry = (() => {
    if (hasWarranty === 'no' || warrantyOption === 'none') return 'No Warranty';
    if (warrantyOption === 'custom') return customWarrantyExpiry || 'Custom Date';

    const baseDate = new Date(purchaseDate);
    if (warrantyOption === '6m') baseDate.setMonth(baseDate.getMonth() + 6);
    else if (warrantyOption === '1yr') baseDate.setFullYear(baseDate.getFullYear() + 1);
    else if (warrantyOption === '2yr') baseDate.setFullYear(baseDate.getFullYear() + 2);
    return baseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  })();

  // Mock File Upload Handler
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    }
  };

  // Form Submit & Validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid positive price';
    }
    if (!purchaseDate) newErrors.purchaseDate = 'Purchase date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast({
        title: 'Validation Error',
        message: 'Please check required fields marked with errors.',
        type: 'error',
      });
      return;
    }

    // Determine return status and days remaining
    const isNoReturn = hasReturnWindow === 'no' || returnWindowOption === '0';
    let returnDeadlineIso = '';
    let deadlineText = 'Return Eligible';
    let returnStatus = 'eligible';

    if (isNoReturn) {
      returnStatus = 'no_return';
      deadlineText = 'No return';
    } else {
      const baseDate = new Date(deliveryDate || purchaseDate);
      const days = returnWindowOption === 'custom' ? 7 : (parseInt(returnWindowOption, 10) || 7);
      baseDate.setDate(baseDate.getDate() + days);
      returnDeadlineIso = baseDate.toISOString().split('T')[0];

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((baseDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        returnStatus = 'expired';
        deadlineText = 'Expired';
      } else if (diffDays === 1) {
        returnStatus = 'expiring';
        deadlineText = 'Tomorrow';
      } else {
        returnStatus = 'eligible';
        deadlineText = `${diffDays} days left`;
      }
    }

    // Warranty calculation
    const isWarrantyActive = hasWarranty === 'yes' && warrantyOption !== 'none';
    let warrantyExpiryDate = '';
    let warrantyDaysLeft = 0;

    if (isWarrantyActive) {
      const wDate = new Date(purchaseDate);
      if (warrantyOption === '6m') wDate.setMonth(wDate.getMonth() + 6);
      else if (warrantyOption === '1yr') wDate.setFullYear(wDate.getFullYear() + 1);
      else if (warrantyOption === '2yr') wDate.setFullYear(wDate.getFullYear() + 2);
      warrantyExpiryDate = wDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      warrantyDaysLeft = Math.max(0, Math.ceil((wDate - today) / (1000 * 60 * 60 * 24)));
    }

    // Assemble purchase object
    const newPurchase = {
      name: name.trim(),
      merchant,
      orderId: orderId.trim() || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      category,
      price: Number(price),
      purchaseDate,
      deliveryDate: deliveryDate
        ? new Date(deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Delivered',
      returnDeadline: calculatedReturnDeadline,
      returnWindowDays: isNoReturn ? 0 : parseInt(returnWindowOption, 10) || 7,
      returnStatus,
      deadlineText,
      isUrgentReturn: returnStatus === 'expiring',
      warrantyActive: isWarrantyActive,
      warrantyExpiry: warrantyExpiryDate,
      warrantyDaysLeft,
      isWarrantyExpiringSoon: warrantyDaysLeft <= 30 && warrantyDaysLeft > 0,
      hasReceipt: Boolean(uploadedFile),
    };

    setIsSubmitting(true);
    try {
      await addPurchase(newPurchase);

      addToast({
        title: 'Purchase Saved to Cloud',
        message: `${newPurchase.name} added to your account in MongoDB.`,
        type: 'success',
      });

      navigate('/app/purchases');
    } catch (err) {
      addToast({
        title: 'Failed to Save',
        message: err.message || 'Could not save purchase to the database.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Back button & Page Title */}
      <div>
        <Link
          to="/app/purchases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-slate-800 dark:hover:text-[#F5F7FA] transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Purchases</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
          Add Purchase
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
          Add a purchase to start tracking its post-purchase lifecycle.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: BASIC DETAILS */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] mb-4 pb-2 border-b border-slate-100 dark:border-[#22262F] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">1</span>
            Basic Purchase Details
          </h3>

          <div className="space-y-4">
            <Input
              label="Product Name *"
              placeholder="e.g. Sony WH-1000XM4 Wireless Headphones"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Price (₹) *"
                type="number"
                placeholder="e.g. 19990"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
                }}
                error={errors.price}
                required
              />

              <Input
                label="Purchase Date *"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                error={errors.purchaseDate}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Store / Merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                options={[
                  { value: 'Amazon India', label: 'Amazon India' },
                  { value: 'Flipkart', label: 'Flipkart' },
                  { value: 'Apple Store', label: 'Apple Store' },
                  { value: 'Croma', label: 'Croma' },
                  { value: 'Myntra', label: 'Myntra' },
                  { value: 'Reliance Digital', label: 'Reliance Digital' },
                  { value: 'Other Store', label: 'Other' },
                ]}
              />

              <Input
                label="Order ID (Optional)"
                placeholder="e.g. 402-892182-1"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />

              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Electronics', label: 'Electronics' },
                  { value: 'Gadgets', label: 'Gadgets' },
                  { value: 'Home Appliances', label: 'Home Appliances' },
                  { value: 'Fashion', label: 'Fashion' },
                  { value: 'Personal', label: 'Personal' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* SECTION 2: DELIVERY */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] mb-4 pb-2 border-b border-slate-100 dark:border-[#22262F] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">2</span>
            Delivery Date
          </h3>

          <div className="max-w-xs">
            <Input
              label="Delivery Date"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              helperText="Return windows are counted starting from this date."
            />
          </div>
        </Card>

        {/* SECTION 3: RETURN WINDOW */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] mb-4 pb-2 border-b border-slate-100 dark:border-[#22262F] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">3</span>
            Return Policy & Deadlines
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#A9B0BC]">Has Return Option?</label>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-[#F5F7FA]">
                  <input
                    type="radio"
                    name="hasReturn"
                    value="yes"
                    checked={hasReturnWindow === 'yes'}
                    onChange={() => setHasReturnWindow('yes')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Yes, returnable</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-[#F5F7FA]">
                  <input
                    type="radio"
                    name="hasReturn"
                    value="no"
                    checked={hasReturnWindow === 'no'}
                    onChange={() => setHasReturnWindow('no')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>No return (Final sale)</span>
                </label>
              </div>
            </div>

            {hasReturnWindow === 'yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <Select
                  label="Return Window Period"
                  value={returnWindowOption}
                  onChange={(e) => setReturnWindowOption(e.target.value)}
                  options={[
                    { value: '7', label: '7 Days (Standard Amazon/Flipkart)' },
                    { value: '10', label: '10 Days' },
                    { value: '14', label: '14 Days (Fashion/Apple)' },
                    { value: '30', label: '30 Days Extended' },
                    { value: 'custom', label: 'Custom Date' },
                  ]}
                />

                {returnWindowOption === 'custom' ? (
                  <Input
                    label="Custom Return Deadline"
                    type="date"
                    value={customReturnDeadline}
                    onChange={(e) => setCustomReturnDeadline(e.target.value)}
                  />
                ) : (
                  <div className="flex flex-col justify-end">
                    <span className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-1 font-medium">Calculated Return Deadline</span>
                    <div className="px-3 py-2 bg-slate-50 dark:bg-[#13161C] border border-slate-200 dark:border-[#292E38] rounded-lg text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">
                      {calculatedReturnDeadline}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* SECTION 4: WARRANTY */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] mb-4 pb-2 border-b border-slate-100 dark:border-[#22262F] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">4</span>
            Warranty Coverage
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#A9B0BC]">Has Manufacturer Warranty?</label>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-[#F5F7FA]">
                  <input
                    type="radio"
                    name="hasWarrantyRadio"
                    value="yes"
                    checked={hasWarranty === 'yes'}
                    onChange={() => setHasWarranty('yes')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Yes, under warranty</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-[#F5F7FA]">
                  <input
                    type="radio"
                    name="hasWarrantyRadio"
                    value="no"
                    checked={hasWarranty === 'no'}
                    onChange={() => setHasWarranty('no')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>No warranty</span>
                </label>
              </div>
            </div>

            {hasWarranty === 'yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <Select
                  label="Warranty Period"
                  value={warrantyOption}
                  onChange={(e) => setWarrantyOption(e.target.value)}
                  options={[
                    { value: '6m', label: '6 Months' },
                    { value: '1yr', label: '1 Year (Standard)' },
                    { value: '2yr', label: '2 Years Extended' },
                    { value: 'custom', label: 'Custom Expiry' },
                  ]}
                />

                {warrantyOption === 'custom' ? (
                  <Input
                    label="Custom Warranty Expiry Date"
                    type="date"
                    value={customWarrantyExpiry}
                    onChange={(e) => setCustomWarrantyExpiry(e.target.value)}
                  />
                ) : (
                  <div className="flex flex-col justify-end">
                    <span className="text-xs text-slate-500 dark:text-[#A9B0BC] mb-1 font-medium">Calculated Warranty Expiry</span>
                    <div className="px-3 py-2 bg-slate-50 dark:bg-[#13161C] border border-slate-200 dark:border-[#292E38] rounded-lg text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">
                      {calculatedWarrantyExpiry}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* SECTION 5: DOCUMENT / RECEIPT */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] mb-4 pb-2 border-b border-slate-100 dark:border-[#22262F] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">5</span>
            Invoice / Receipt Attachment
          </h3>

          <div>
            {!uploadedFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-[#292E38] rounded-xl p-6 hover:bg-slate-50/60 dark:hover:bg-[#1C2028]/60 cursor-pointer transition-colors text-center">
                <Upload className="w-6 h-6 text-slate-400 dark:text-[#747C89] mb-2" />
                <span className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">Click to upload invoice / receipt</span>
                <span className="text-[11px] text-slate-400 dark:text-[#747C89] mt-0.5">PDF, PNG, JPG up to 10MB</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#13161C] border border-slate-200 dark:border-[#292E38] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white dark:bg-[#1C2028] rounded-lg border border-slate-200 dark:border-[#292E38] text-blue-600 dark:text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">{uploadedFile.name}</h5>
                    <span className="text-[11px] text-slate-400 dark:text-[#747C89]">{uploadedFile.size}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="p-1 rounded text-slate-400 dark:text-[#747C89] hover:text-slate-600 dark:hover:text-[#F5F7FA] hover:bg-slate-200/60 dark:hover:bg-[#232833] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-[#22262F]">
          <Button
            variant="outline"
            size="medium"
            onClick={() => navigate('/app/purchases')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
          >
            Save Purchase
          </Button>
        </div>
      </form>
    </div>
  );
};
