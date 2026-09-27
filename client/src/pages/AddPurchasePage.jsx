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
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  Maximize2,
  Trash2,
  FileCheck
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { SearchableStoreSelect } from '../components/ui/SearchableStoreSelect';
import { AdvancedDatePicker } from '../components/ui/AdvancedDatePicker';
import { usePurchases } from '../context/PurchaseContext';
import { useToast } from '../components/ui/Toast';
import { InvoicePreviewModal } from '../components/documents/InvoicePreviewModal';

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
  const [customMerchant, setCustomMerchant] = useState('');
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

  // Real Document Upload with interactive preview
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showInlinePreview, setShowInlinePreview] = useState(false);
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

  // Real File Upload Handler (reads base64 DataURL and creates clean Blob URL for instant in-tab preview)
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        let blobUrl = '';
        try {
          blobUrl = URL.createObjectURL(file);
        } catch {
          blobUrl = reader.result;
        }

        const isPdf = file.type.includes('pdf') || /\.pdf$/i.test(file.name);
        const isImage = file.type.startsWith('image') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);

        setUploadedFile({
          file,
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          previewUrl: reader.result,
          blobUrl,
          receiptUrl: reader.result,
          receiptFileName: file.name,
          receiptFileType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
          isPdf,
          isImage,
        });
        setShowInlinePreview(true); // Automatically open in-tab preview on upload
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct 1-Click File Download Handler (same tab, no new window needed)
  const handleDownloadAttachment = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!uploadedFile) return;

    const downloadHref = uploadedFile.blobUrl || uploadedFile.previewUrl || uploadedFile.receiptUrl;
    if (!downloadHref) return;

    const link = document.createElement('a');
    link.href = downloadHref;
    link.download = uploadedFile.name || 'Invoice_Document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Download Started',
      message: `Downloading ${uploadedFile.name}`,
      type: 'success',
    });
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
    if (!merchant.trim() || merchant === 'Other Store' || merchant === 'Other') {
      newErrors.merchant = 'Please select or type a store / merchant name';
    }

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

      if (diffDays < 0) {
        returnStatus = 'expired';
        deadlineText = 'Expired';
      } else if (diffDays === 0) {
        returnStatus = 'expiring';
        deadlineText = 'Ends today';
      } else if (diffDays === 1) {
        returnStatus = 'expiring';
        deadlineText = 'Tomorrow';
      } else if (diffDays === 2) {
        returnStatus = 'expiring';
        deadlineText = '2 days left';
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
    const finalMerchant = merchant.trim() || 'Retail Store';

    const newPurchase = {
      name: name.trim(),
      merchant: finalMerchant,
      orderId: orderId.trim() || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      category: category || 'General',
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
      receiptUrl: uploadedFile?.receiptUrl || '',
      receiptFileName: uploadedFile?.receiptFileName || '',
      receiptFileType: uploadedFile?.receiptFileType || '',
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

              <AdvancedDatePicker
                label="Purchase Date"
                value={purchaseDate}
                onChange={(val) => {
                  setPurchaseDate(val);
                  if (errors.purchaseDate) setErrors((prev) => ({ ...prev, purchaseDate: null }));
                }}
                error={errors.purchaseDate}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SearchableStoreSelect
                label="Store / Merchant *"
                value={merchant}
                onChange={(val) => {
                  setMerchant(val);
                  if (errors.merchant) setErrors((prev) => ({ ...prev, merchant: null }));
                }}
                onStoreChange={(store) => {
                  if (store.defaultReturnDays) {
                    setReturnWindowOption(String(store.defaultReturnDays));
                  }
                  if (store.category) {
                    setCategory(store.category);
                  }
                  if (store.isCustom) {
                    setCustomMerchant(store.name);
                  }
                }}
                error={errors.merchant}
              />

              <Input
                label="Order ID (Optional)"
                placeholder="e.g. 402-892182-1"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                helperText="Helps in warranty claims and invoice lookup"
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

          <div className="max-w-md">
            <AdvancedDatePicker
              label="Delivery Date"
              value={deliveryDate}
              onChange={(val) => setDeliveryDate(val)}
              minDate={purchaseDate}
              presets={[
                { label: 'Same day', daysOffset: 0 },
                { label: 'Next day', daysOffset: 1 },
                { label: '3 days later', daysOffset: 3 },
              ]}
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
                    { value: '15', label: '15 Days (Retail Standard)' },
                    { value: '30', label: '30 Days Extended' },
                    { value: 'custom', label: 'Custom Return Date' },
                  ]}
                />

                {returnWindowOption === 'custom' ? (
                  <AdvancedDatePicker
                    label="Custom Return Deadline"
                    value={customReturnDeadline}
                    onChange={(val) => setCustomReturnDeadline(val)}
                    minDate={deliveryDate || purchaseDate}
                    presets={[
                      { label: '+7 Days', daysOffset: 7 },
                      { label: '+14 Days', daysOffset: 14 },
                      { label: '+30 Days', daysOffset: 30 },
                    ]}
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
                  <AdvancedDatePicker
                    label="Custom Warranty Expiry Date"
                    value={customWarrantyExpiry}
                    onChange={(val) => setCustomWarrantyExpiry(val)}
                    minDate={purchaseDate}
                    presets={[
                      { label: '+6 Months', daysOffset: 180 },
                      { label: '+1 Year', daysOffset: 365 },
                      { label: '+2 Years', daysOffset: 730 },
                    ]}
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
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-[#22262F]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">5</span>
              Invoice / Receipt Attachment
            </h3>
            {uploadedFile && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                Attached
              </span>
            )}
          </div>

          <div className="space-y-4">
            {!uploadedFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-[#292E38] rounded-2xl p-7 hover:bg-slate-50/60 dark:hover:bg-[#1C2028]/60 cursor-pointer transition-all hover:border-blue-400 dark:hover:border-blue-500/50 text-center group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">Click to upload invoice / receipt</span>
                <span className="text-[11px] text-slate-400 dark:text-[#747C89] mt-1">PDF, PNG, JPG up to 10MB</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              <div className="space-y-3">
                {/* Uploaded File Bar with Direct Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 dark:bg-[#13161C] border border-slate-200 dark:border-[#292E38] rounded-2xl gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1C2028] border border-slate-200 dark:border-[#292E38] text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA] truncate">
                          {uploadedFile.name}
                        </h5>
                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 uppercase">
                          {uploadedFile.isPdf ? 'PDF' : 'IMAGE'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-[#747C89]">
                        {uploadedFile.size} • Attached
                      </span>
                    </div>
                  </div>

                  {/* Actions: View in Same Tab, Download, Modal & Remove */}
                  <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap shrink-0">
                    {/* View Attached File */}
                    <Button
                      type="button"
                      variant={showInlinePreview ? 'primary' : 'outline'}
                      size="small"
                      icon={showInlinePreview ? EyeOff : Eye}
                      onClick={() => setShowInlinePreview(!showInlinePreview)}
                      className="text-xs py-1.5 px-3"
                    >
                      {showInlinePreview ? 'Hide' : 'View'}
                    </Button>

                    {/* Direct 1-Click Download Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="small"
                      icon={Download}
                      onClick={handleDownloadAttachment}
                      className="text-xs py-1.5 px-3 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Download file directly"
                    >
                      Download
                    </Button>

                    {/* Full Screen View Modal */}
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-[#292E38] text-slate-500 hover:text-slate-800 dark:text-[#A9B0BC] dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1E232D] transition-colors cursor-pointer"
                      title="Open full view modal"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Remove File */}
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        setShowInlinePreview(false);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-[#292E38] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Remove attachment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* INLINE IN-TAB VIEWER (Renders directly inside Section 5 in the exact same tab) */}
                {showInlinePreview && (
                  <div className="rounded-2xl border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#161921] p-3 sm:p-4 shadow-sm animate-in fade-in duration-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#22262F] pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-semibold text-slate-700 dark:text-[#A9B0BC]">
                          Viewing {uploadedFile.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleDownloadAttachment}
                          className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                        <span className="text-slate-300 dark:text-[#2A303C]">|</span>
                        <button
                          type="button"
                          onClick={() => setIsPreviewOpen(true)}
                          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:text-[#A9B0BC] dark:hover:text-white cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          Full View
                        </button>
                      </div>
                    </div>

                    {/* Content Display: Image vs PDF */}
                    <div className="w-full flex items-center justify-center bg-slate-50 dark:bg-[#0E1015] rounded-xl overflow-hidden min-h-[300px] max-h-[520px]">
                      {uploadedFile.isImage ? (
                        <div className="p-3 w-full h-full flex items-center justify-center">
                          <img
                            src={uploadedFile.previewUrl}
                            alt={uploadedFile.name}
                            className="max-h-[460px] max-w-full object-contain rounded-lg shadow-sm"
                          />
                        </div>
                      ) : (
                        <iframe
                          src={`${uploadedFile.blobUrl || uploadedFile.previewUrl}#toolbar=1`}
                          title={uploadedFile.name}
                          className="w-full h-[460px] border-0 rounded-xl"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Invoice Preview Modal (only accessible when an invoice file is uploaded) */}
        {uploadedFile && (
          <InvoicePreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            document={{
              name: name || 'Purchase Receipt',
              merchant: merchant || 'Store',
              orderId: orderId || 'NEW-ORDER',
              price: Number(price) || 0,
              category,
              purchaseDate: purchaseDate || 'Today',
              deliveryDate,
              returnDeadline: calculatedReturnDeadline,
              warrantyExpiry: calculatedWarrantyExpiry,
              receiptUrl: uploadedFile?.blobUrl || uploadedFile?.previewUrl || '',
              receiptFileName: uploadedFile?.name || '',
              receiptFileType: uploadedFile?.receiptFileType || uploadedFile?.fileType || '',
            }}
          />
        )}

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
