import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Upload,
  Download,
  ExternalLink,
  Plus,
  ShieldCheck,
  Search,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { usePurchases } from '../context/PurchaseContext';
import { useToast } from '../components/ui/Toast';
import { InvoicePreviewModal } from '../components/documents/InvoicePreviewModal';

export const DocumentsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { purchases } = usePurchases();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const docPurchases = purchases.filter((p) => p.hasReceipt);

  const filteredDocs = docPurchases.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.merchant.toLowerCase().includes(q) ||
      (p.orderId && p.orderId.toLowerCase().includes(q))
    );
  });

  const handleDownload = (item) => {
    addToast({
      title: 'Invoice Retrieved',
      message: `Tax invoice for ${item.name} downloaded securely.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
          Encrypted Document Vault
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
          Authorized tax invoices, warranty certificates, and proof-of-purchase PDFs stored securely.
        </p>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-blue-900 dark:text-blue-200">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            Documents are encrypted at rest with AES-256 and accessible only by you during warranty claims and tax filings.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60 shrink-0 self-start sm:self-center">
          Vault Sealed
        </span>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by product, merchant or invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] text-xs text-slate-900 dark:text-[#F5F7FA] placeholder:text-slate-400 dark:placeholder:text-[#747C89] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <span className="text-xs text-slate-400">
          {filteredDocs.length} archived files
        </span>
      </div>

      {/* Documents Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {filteredDocs.length > 0 ? (
            <Table containerClassName="border-0 rounded-none">
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHead>Document</TableHead>
                  <TableHead>Associated Order</TableHead>
                  <TableHead>Store / Vendor</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Archive Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span>{item.receiptFileName || `Tax_Invoice_${item.orderId || item.id}.pdf`}</span>
                          <span className="text-[10px] text-slate-400">Tax Invoice & Warranty Certificate</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-[#F5F7FA]">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-[#A9B0BC]">
                      {item.merchant}
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#1C2028] px-2 py-0.5 rounded text-slate-600 dark:text-[#A9B0BC]">
                        {item.receiptFileType?.startsWith('image') ? 'IMAGE' : 'PDF'} • Stored
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-[#A9B0BC]">
                      {item.deliveryDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="primary"
                          size="small"
                          icon={Eye}
                          className="text-xs py-1 px-2.5"
                          onClick={() => {
                            setSelectedDoc(item);
                            setIsViewerOpen(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          icon={Download}
                          className="text-xs py-1 px-2.5"
                          onClick={() => handleDownload(item)}
                        >
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-slate-400 dark:text-[#747C89] text-xs">
              No documents found. Upload an invoice to store in your vault.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        document={selectedDoc}
      />
    </div>
  );
};
