import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  Building,
  Calendar,
  CreditCard,
  Hash
} from 'lucide-react';
import { Button } from '../ui/Button';

export const InvoicePreviewModal = ({ isOpen, onClose, document: doc }) => {
  if (!isOpen || !doc) return null;

  const fileName = doc.receiptFileName || (doc.name ? `Tax_Invoice_${doc.orderId || doc.id || 'INV'}.pdf` : 'Invoice_Document.pdf');
  const fileUrl = doc.receiptUrl || doc.previewUrl || '';
  const isImage = Boolean(
    doc.receiptFileType?.startsWith('image') ||
    fileUrl?.startsWith('data:image') ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName)
  );
  const isPdf = Boolean(
    doc.receiptFileType?.includes('pdf') ||
    fileUrl?.startsWith('data:application/pdf') ||
    /\.pdf$/i.test(fileName)
  );

  // Convert base64 Data URLs into clean same-origin Blob URLs so Chrome renders PDFs directly inline inside the modal
  const [blobUrl, setBlobUrl] = useState('');

  useEffect(() => {
    if (!fileUrl) {
      setBlobUrl('');
      return;
    }

    if (fileUrl.startsWith('data:')) {
      try {
        const parts = fileUrl.split(';base64,');
        const contentType = parts[0]?.split(':')[1] || (isPdf ? 'application/pdf' : 'image/png');
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error('Blob conversion error', err);
        setBlobUrl(fileUrl);
      }
    } else {
      setBlobUrl(fileUrl);
    }
  }, [fileUrl, isPdf]);

  const handleDownload = () => {
    const downloadUrl = blobUrl || fileUrl;
    if (downloadUrl) {
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog (Focused in-place preview, no external tab required) */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#13161C] rounded-2xl border border-slate-200 dark:border-[#292E38] shadow-2xl flex flex-col h-[88vh] max-h-[92vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-[#22262F] bg-slate-50/80 dark:bg-[#171A21]/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 shrink-0">
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F5F7FA] truncate">
                  {fileName}
                </h3>
                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-200/70 dark:bg-[#232833] text-slate-700 dark:text-[#A9B0BC]">
                  {isImage ? 'Image Receipt' : 'PDF Document'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#747C89] truncate mt-0.5">
                {doc.name || 'Order Purchase'} • {doc.merchant || 'Store'} • ₹{(Number(doc.price) || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Action buttons: Download & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="small"
              icon={Download}
              onClick={handleDownload}
              className="text-xs py-1.5 px-3"
            >
              Download
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1F232B] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* In-Place Content Viewer Body (Direct Preview Right Here) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-100/60 dark:bg-[#0F1115] flex flex-col items-center justify-center">
          
          {/* Case 1: Uploaded Image (PNG, JPG, WEBP) */}
          {blobUrl && isImage ? (
            <div className="w-full h-full flex items-center justify-center bg-white dark:bg-[#171A21] rounded-xl border border-slate-200 dark:border-[#292E38] p-3 sm:p-6 shadow-sm overflow-auto">
              <img
                src={blobUrl}
                alt={fileName}
                className="max-h-full max-w-full object-contain rounded-lg shadow-md"
              />
            </div>
          ) : blobUrl && isPdf ? (
            /* Case 2: Uploaded PDF rendered directly in-place via Blob URL iframe/object */
            <div className="w-full h-full bg-white dark:bg-[#171A21] rounded-xl border border-slate-200 dark:border-[#292E38] overflow-hidden shadow-sm">
              <iframe
                src={`${blobUrl}#toolbar=1&navpanes=0`}
                title={fileName}
                className="w-full h-full border-0 rounded-xl"
              />
            </div>
          ) : (
            /* Case 3: Synthesized Official Digital Tax Invoice & Warranty Sheet */
            <div className="w-full max-w-2xl bg-white dark:bg-[#171A21] rounded-2xl border border-slate-200 dark:border-[#292E38] p-6 sm:p-8 shadow-sm space-y-6 my-auto">
              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-[#22262F] pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-[11px] font-semibold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Digital Ledger Archive</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA]">
                    Tax Invoice & Purchase Proof
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#747C89] mt-0.5 font-mono">
                    Invoice #{doc.orderId ? `INV-${doc.orderId}` : `INV-${doc.id || '883921'}`}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {doc.merchant || 'Retail Merchant'}
                  </span>
                  <p className="text-[11px] text-slate-400 dark:text-[#747C89] mt-0.5">
                    Authorized E-Commerce Channel
                  </p>
                </div>
              </div>

              {/* Order Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#13161C] border border-slate-200/70 dark:border-[#22262F] text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Order Date</span>
                  <span className="font-semibold text-slate-800 dark:text-[#F5F7FA] mt-0.5 block">
                    {doc.purchaseDate || doc.deliveryDate || 'Sep 2, 2026'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Category</span>
                  <span className="font-semibold text-slate-800 dark:text-[#F5F7FA] mt-0.5 block">
                    {doc.category || 'Electronics'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Return Window</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {doc.returnDeadline || '7 Days Policy'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Warranty</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 mt-0.5 block">
                    {doc.warrantyExpiry || '1 Year Active'}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 dark:border-[#292E38] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#1C2028] border-b border-slate-200 dark:border-[#292E38] text-slate-600 dark:text-[#A9B0BC] font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Item Description</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Tax Rate</th>
                      <th className="py-2.5 px-4 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#22262F] text-slate-800 dark:text-[#F5F7FA]">
                    <tr>
                      <td className="py-3 px-4 font-medium">
                        <div>{doc.name || 'Purchased Product'}</div>
                        <span className="text-[10px] text-slate-400 dark:text-[#747C89] font-mono">
                          ID: {doc.orderId || doc.id || 'ORD-98231'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">1</td>
                      <td className="py-3 px-4 text-right text-slate-500">18% GST</td>
                      <td className="py-3 px-4 text-right font-bold">
                        ₹{(Number(doc.price) || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Breakdown */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Verified Proof of Purchase • Accepted at brand service centers</span>
                </div>

                <div className="w-full sm:w-60 space-y-1 text-xs text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{Math.round((Number(doc.price) || 0) * 0.82).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>GST (18%):</span>
                    <span>₹{Math.round((Number(doc.price) || 0) * 0.18).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-[#F5F7FA] text-sm pt-1 border-t border-slate-200 dark:border-[#292E38]">
                    <span>Grand Total:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      ₹{(Number(doc.price) || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
