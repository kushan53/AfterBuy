import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Select,
  Textarea,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  Modal,
  ConfirmDialog,
  useToast,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState,
  StatCard,
  SectionHeader,
  StatusBadge,
} from '../components/ui';
import {
  Plus,
  Trash2,
  Download,
  MoreVertical,
  ShieldCheck,
  RotateCcw,
  BadgePercent,
  FileText,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Inbox,
  Filter,
} from 'lucide-react';

export const DesignSystemReviewPage = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [inputVal, setInputVal] = useState('Sony WH-1000XM4');

  return (
    <div className="space-y-10">
      {/* Overview Banner */}
      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-white to-slate-50/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                Foundation Showcase
              </span>
              <span className="text-xs text-slate-400">AfterBuy Design System v0.1</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1.5">
              UI System & Application Shell
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Every reusable atom, molecule, and component built strictly to the design principles: light aesthetic, restrained palette, dense typography, and deadline-driven post-purchase states.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="small"
              onClick={() => {
                addToast({
                  title: 'Demo Toast (Info)',
                  message: 'This is a sample notification showing how toasts appear.',
                  type: 'info',
                });
              }}
            >
              Trigger Toast
            </Button>
            <Button
              variant="primary"
              size="small"
              icon={Plus}
              onClick={() => setIsModalOpen(true)}
            >
              Open Modal
            </Button>
          </div>
        </div>
      </div>

      {/* 1. Stat Cards Showcase */}
      <section>
        <SectionHeader
          title="1. Stat Cards"
          description="High-level metrics for financial tracking and post-purchase urgency."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Pending Refunds"
            value="₹14,299"
            supportingText="Across 2 orders"
            trend="1 Overdue"
            trendType="warning"
            icon={BadgePercent}
          />
          <StatCard
            label="Active Return Windows"
            value="3 Items"
            supportingText="Earliest ends tomorrow"
            trend="Urgent"
            trendType="negative"
            icon={RotateCcw}
          />
          <StatCard
            label="Warranties Protected"
            value="18 Active"
            supportingText="2 expiring within 30 days"
            trend="Protected"
            trendType="positive"
            icon={ShieldCheck}
          />
          <StatCard
            label="Stored Invoices"
            value="24 Files"
            supportingText="All synced & verified"
            trend="Organized"
            trendType="neutral"
            icon={FileText}
          />
        </div>
      </section>

      {/* 2. Buttons & Interactions */}
      <section>
        <SectionHeader
          title="2. Buttons"
          description="Clear visual hierarchy with restrained primary accent, clean outlines, and explicit danger states."
        />
        <Card className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Action</Button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Sizes:</span>
            <Button variant="primary" size="small" icon={Plus}>Small (+ Icon)</Button>
            <Button variant="primary" size="medium" icon={Plus}>Medium (Default)</Button>
            <Button variant="primary" size="large" icon={Plus}>Large Button</Button>
            <Button variant="outline" size="small" disabled>Disabled</Button>
          </div>
        </Card>
      </section>

      {/* 3. Badges & Status System */}
      <section>
        <SectionHeader
          title="3. Badges & AfterBuy Status System"
          description="Subtle status indicators communicating urgency and lifecycle stage without giant decorative blocks."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Generic Badges</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="info">Information</Badge>
              <Badge variant="success" dot>Success Active</Badge>
              <Badge variant="warning" dot>Warning Pending</Badge>
              <Badge variant="danger" dot>Action Overdue</Badge>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Post-Purchase Domain Statuses</h4>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="return-eligible" />
              <StatusBadge status="return-expiring" />
              <StatusBadge status="return-expired" />
              <StatusBadge status="refund-pending" />
              <StatusBadge status="refund-overdue" />
              <StatusBadge status="refund-received" />
              <StatusBadge status="warranty-active" />
              <StatusBadge status="warranty-expiring" />
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Form Controls & Inputs */}
      <section>
        <SectionHeader
          title="4. Form Inputs & Selects"
          description="Precise borders, subtle focus rings, clear error feedback, and semantic labels."
        />
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              label="Product Name"
              placeholder="e.g. MacBook Air M3"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              helperText="Exact title from your order invoice"
            />
            <Select
              label="Store / Merchant"
              options={[
                { value: 'amazon', label: 'Amazon' },
                { value: 'apple', label: 'Apple Store' },
                { value: 'flipkart', label: 'Flipkart' },
              ]}
              helperText="Where you completed the purchase"
            />
            <Input
              label="Order ID (With Error Demo)"
              defaultValue="INVALID-ORD"
              error="Order ID format does not match merchant format"
            />
            <Input
              label="Disabled Input"
              value="₹24,999 (Locked)"
              disabled
              helperText="Cannot be edited once settled"
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Return Notes / Reason"
                placeholder="Item had slight discoloration on the edge..."
                rows={2}
                helperText="Optional notes for customer support reference"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* 5. Reusable Table System */}
      <section>
        <SectionHeader
          title="5. Data Table System"
          description="High density tabular layout for purchase orders, returns, and refund tracking."
          action={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="small" icon={Filter}>Filter</Button>
              <Button variant="outline" size="small" icon={Download}>Export</Button>
            </div>
          }
        />
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              <TableHead>Item & Merchant</TableHead>
              <TableHead>Purchased</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Return Status</TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">Sony WH-1000XM4 Headphones</span>
                  <span className="text-slate-400 text-[11px]">Amazon • Order #402-892182-1</span>
                </div>
              </TableCell>
              <TableCell>Aug 28, 2026</TableCell>
              <TableCell className="font-semibold text-slate-900">₹8,499</TableCell>
              <TableCell>
                <StatusBadge status="return-expiring" />
                <span className="block text-[11px] text-amber-700 mt-0.5 font-medium">Expires in 1 day</span>
              </TableCell>
              <TableCell>
                <StatusBadge status="warranty-active" />
                <span className="block text-[11px] text-slate-400 mt-0.5">362 days left</span>
              </TableCell>
              <TableCell className="text-right">
                <Dropdown
                  align="right"
                  trigger={
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  }
                >
                  <DropdownLabel>Actions</DropdownLabel>
                  <DropdownItem icon={ExternalLink}>View Order Details</DropdownItem>
                  <DropdownItem icon={RotateCcw}>Request Return</DropdownItem>
                  <DropdownItem icon={FileText}>View Invoice</DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem icon={Trash2} danger onClick={() => setIsConfirmOpen(true)}>
                    Delete Record
                  </DropdownItem>
                </Dropdown>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">Logitech MX Master 3S Mouse</span>
                  <span className="text-slate-400 text-[11px]">Croma • Order #CR-88192</span>
                </div>
              </TableCell>
              <TableCell>Aug 15, 2026</TableCell>
              <TableCell className="font-semibold text-slate-900">₹7,995</TableCell>
              <TableCell>
                <StatusBadge status="refund-overdue" />
                <span className="block text-[11px] text-rose-700 mt-0.5 font-medium">2 days overdue</span>
              </TableCell>
              <TableCell>
                <StatusBadge status="warranty-active" />
                <span className="block text-[11px] text-slate-400 mt-0.5">1 yr remaining</span>
              </TableCell>
              <TableCell className="text-right">
                <Dropdown
                  align="right"
                  trigger={
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  }
                >
                  <DropdownLabel>Actions</DropdownLabel>
                  <DropdownItem icon={ExternalLink}>View Refund Status</DropdownItem>
                  <DropdownItem icon={FileText}>Download Invoice</DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem icon={Trash2} danger onClick={() => setIsConfirmOpen(true)}>
                    Delete Record
                  </DropdownItem>
                </Dropdown>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* 6. Empty State Component */}
      <section>
        <SectionHeader
          title="6. Empty State"
          description="Consistent fallback layout when filters return 0 results or categories are empty."
        />
        <EmptyState
          icon={Inbox}
          title="No pending returns found"
          description="All purchases are currently within satisfied ownership or return windows have closed."
          action={
            <Button variant="secondary" size="small" icon={Plus}>
              Log a New Return
            </Button>
          }
        />
      </section>

      {/* Modals & Dialogs used in demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Dialog Modal"
        description="Standard modal container with accessible backdrop, keyboard escape, and focus safety."
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            This modal illustrates how complex workflows—like adding a receipt, logging a return courier tracking number, or updating warranty details—will be contained cleanly without cluttering the screen.
          </p>
          <Input label="Example Input" defaultValue="Pre-populated value" />
        </div>
        <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button variant="outline" size="small" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              setIsModalOpen(false);
              addToast({
                title: 'Action Succeeded',
                message: 'Modal closed and state updated.',
                type: 'success',
              });
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          addToast({
            title: 'Record Removed',
            message: 'Item has been deleted from your workspace.',
            type: 'error',
          });
        }}
        title="Delete Purchase Record?"
        description="This will permanently delete this purchase and its linked warranty countdown and receipt. This action cannot be reversed."
        confirmText="Delete Record"
        variant="danger"
      />
    </div>
  );
};
