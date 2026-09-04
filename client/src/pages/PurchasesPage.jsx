import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  BadgePercent,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Inbox,
  MoreVertical,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Dropdown, DropdownItem, DropdownSeparator } from '../components/ui/Dropdown';
import { usePurchases } from '../context/PurchaseContext';
import { useToast } from '../components/ui/Toast';
import { formatINR, getReturnInfo, getWarrantyInfo, getLifecycleStatus } from '../utils/purchaseUtils';

export const PurchasesPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { purchases, updatePurchase, deletePurchase } = usePurchases();

  // Edit / Delete State
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [deletingPurchase, setDeletingPurchase] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', merchant: '', price: '', orderId: '', category: '' });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [sortBy, setSortBy] = useState('Newest First');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination State (10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. DYNAMIC COMPACT SUMMARY STATS (Derived from purchases)
  const summary = useMemo(() => {
    const total = purchases.length;
    const returnEligible = purchases.filter(
      (p) => p.returnStatus === 'eligible' || p.returnStatus === 'expiring'
    ).length;
    const inReturnProcess = purchases.filter(
      (p) =>
        p.returnStatus === 'return_requested' ||
        p.returnStatus === 'picked_up' ||
        (p.refund && !p.refund.settled)
    ).length;
    const underWarranty = purchases.filter((p) => p.warrantyActive).length;

    return { total, returnEligible, inReturnProcess, underWarranty };
  }, [purchases]);

  // 2. SEARCH, FILTER & SORT PIPELINE
  const filteredPurchases = useMemo(() => {
    return purchases
      .filter((p) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchStore = p.merchant?.toLowerCase().includes(q);
          const matchOrder = p.orderId?.toLowerCase().includes(q);
          const matchCat = p.category?.toLowerCase().includes(q);
          if (!matchName && !matchStore && !matchOrder && !matchCat) return false;
        }

        // Category Filter
        if (categoryFilter !== 'All Categories' && p.category !== categoryFilter) {
          return false;
        }

        // Status Filter
        if (statusFilter !== 'All') {
          if (statusFilter === 'Return Eligible') {
            if (p.returnStatus !== 'eligible' && p.returnStatus !== 'expiring') return false;
          } else if (statusFilter === 'Return In Progress') {
            if (p.returnStatus !== 'return_requested' && p.returnStatus !== 'picked_up') return false;
          } else if (statusFilter === 'Refund Pending') {
            if (!p.refund || p.refund.settled || p.refund.status === 'refund-received') return false;
          } else if (statusFilter === 'Refunded') {
            if (!p.refund || (!p.refund.settled && p.refund.status !== 'refund-received')) return false;
          } else if (statusFilter === 'Warranty Active') {
            if (!p.warrantyActive) return false;
          } else if (statusFilter === 'Completed') {
            if (p.returnStatus !== 'expired' && p.returnStatus !== 'kept') return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Newest First') {
          return new Date(b.purchaseDate || 0) - new Date(a.purchaseDate || 0);
        }
        if (sortBy === 'Oldest First') {
          return new Date(a.purchaseDate || 0) - new Date(b.purchaseDate || 0);
        }
        if (sortBy === 'Highest Price') {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === 'Lowest Price') {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === 'Return Deadline') {
          return (a.returnWindowDays || 0) - (b.returnWindowDays || 0);
        }
        if (sortBy === 'Warranty Expiry') {
          return (a.warrantyDaysLeft || 0) - (b.warrantyDaysLeft || 0);
        }
        return 0;
      });
  }, [purchases, searchQuery, statusFilter, categoryFilter, sortBy]);

  // 3. PAGINATION CALCULATION
  const totalPages = Math.max(1, Math.ceil(filteredPurchases.length / itemsPerPage));
  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPurchases.slice(start, start + itemsPerPage);
  }, [filteredPurchases, currentPage]);

  // Initial avatar generator (e.g. Sony WH -> SW, Keychron -> KC)
  const getInitials = (name) => {
    if (!name) return 'PR';
    const words = name.trim().split(' ');
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. PAGE HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
          Purchases
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#A9B0BC] mt-1">
          Track and manage everything you've bought.
        </p>
      </div>

      {/* 2. COMPACT SUMMARY CARDS (4 CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#171A21] p-4 rounded-xl border border-slate-200/80 dark:border-[#292E38] shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 dark:text-[#A9B0BC] block">Total Purchases</span>
          <div className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">{summary.total}</div>
          <span className="text-[10px] text-slate-400 dark:text-[#747C89] mt-0.5 block">All logged items</span>
        </div>

        <div className="bg-white dark:bg-[#171A21] p-4 rounded-xl border border-slate-200/80 dark:border-[#292E38] shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 dark:text-[#A9B0BC] block">Return Eligible</span>
          <div className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">{summary.returnEligible}</div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-0.5 block">Windows active</span>
        </div>

        <div className="bg-white dark:bg-[#171A21] p-4 rounded-xl border border-slate-200/80 dark:border-[#292E38] shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 dark:text-[#A9B0BC] block">In Return Process</span>
          <div className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">{summary.inReturnProcess}</div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5 block">Pickup or refund awaiting</span>
        </div>

        <div className="bg-white dark:bg-[#171A21] p-4 rounded-xl border border-slate-200/80 dark:border-[#292E38] shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 dark:text-[#A9B0BC] block">Under Warranty</span>
          <div className="text-xl font-bold text-slate-900 dark:text-[#F5F7FA] mt-1">{summary.underWarranty}</div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5 block">Coverage protected</span>
        </div>
      </div>

      {/* 3 & 4. SEARCH & COMPACT FILTER BAR */}
      <Card className="p-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#747C89] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products, stores, or order IDs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 dark:border-[#292E38] bg-slate-50/50 dark:bg-[#13161C] pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-[#F5F7FA] placeholder:text-slate-400 dark:placeholder:text-[#747C89] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Dropdowns (Desktop) */}
        <div className="hidden sm:flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-[#22262F] text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] px-2.5 py-1.5 text-xs text-slate-700 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Return Eligible">Status: Return Eligible</option>
              <option value="Return In Progress">Status: Return In Progress</option>
              <option value="Refund Pending">Status: Refund Pending</option>
              <option value="Refunded">Status: Refunded</option>
              <option value="Warranty Active">Status: Warranty Active</option>
              <option value="Completed">Status: Completed</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] px-2.5 py-1.5 text-xs text-slate-700 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All Categories">Category: All</option>
              <option value="Electronics">Electronics</option>
              <option value="Home Appliances">Home Appliances</option>
              <option value="Fashion">Fashion</option>
              <option value="Gadgets">Gadgets</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] px-2.5 py-1.5 text-xs text-slate-700 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All Time">Date: All Time</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-[#747C89] text-xs">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#171A21] px-2.5 py-1.5 text-xs text-slate-700 dark:text-[#F5F7FA] font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Highest Price">Highest Price</option>
              <option value="Lowest Price">Lowest Price</option>
              <option value="Return Deadline">Return Deadline</option>
              <option value="Warranty Expiry">Warranty Expiry</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="sm:hidden pt-1 flex items-center justify-between">
          <Button
            variant="outline"
            size="small"
            icon={SlidersHorizontal}
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            Filters ({statusFilter !== 'All' ? '1 Active' : 'Default'})
          </Button>
          <span className="text-[11px] text-slate-400">
            {filteredPurchases.length} items found
          </span>
        </div>

        {/* Mobile Filter Expandable Section */}
        {mobileFilterOpen && (
          <div className="sm:hidden pt-3 border-t border-slate-100 dark:border-[#22262F] space-y-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] p-2.5 text-xs text-slate-700 dark:text-[#F5F7FA]"
            >
              <option value="All">Status: All</option>
              <option value="Return Eligible">Return Eligible</option>
              <option value="Return In Progress">Return In Progress</option>
              <option value="Refund Pending">Refund Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Warranty Active">Warranty Active</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] p-2.5 text-xs text-slate-700 dark:text-[#F5F7FA]"
            >
              <option value="All Categories">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Home Appliances">Home Appliances</option>
              <option value="Fashion">Fashion</option>
              <option value="Gadgets">Gadgets</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-[#292E38] bg-white dark:bg-[#13161C] p-2.5 text-xs text-slate-700 dark:text-[#F5F7FA]"
            >
              <option value="Newest First">Sort: Newest First</option>
              <option value="Highest Price">Sort: Highest Price</option>
              <option value="Lowest Price">Sort: Lowest Price</option>
            </select>
          </div>
        )}
      </Card>

      {/* 5. MAIN PURCHASE TABLE (Desktop & Tablet) */}
      <div className="hidden md:block">
        {filteredPurchases.length > 0 ? (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHead>PRODUCT</TableHead>
                  <TableHead>MERCHANT</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead>PURCHASED</TableHead>
                  <TableHead>RETURN</TableHead>
                  <TableHead>WARRANTY</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead className="text-right">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPurchases.map((purchase) => {
                  const returnInfo = getReturnInfo(purchase);
                  const warrantyInfo = getWarrantyInfo(purchase);
                  const lifecycle = getLifecycleStatus(purchase);

                  return (
                    <TableRow key={purchase.id}>
                      {/* Product Cell */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#1C2028] border border-slate-200 dark:border-[#292E38] flex items-center justify-center font-bold text-slate-700 dark:text-[#F5F7FA] text-xs shrink-0 tracking-tight">
                            {getInitials(purchase.name)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-slate-900 dark:text-[#F5F7FA] truncate">
                              {purchase.name}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-[#747C89] font-mono truncate">
                              {purchase.orderId ? `Order #${purchase.orderId}` : purchase.category}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Merchant */}
                      <TableCell className="text-slate-600 dark:text-[#A9B0BC] font-medium">
                        {purchase.merchant}
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                        {formatINR(purchase.price)}
                      </TableCell>

                      {/* Purchased Date */}
                      <TableCell className="text-slate-500 dark:text-[#A9B0BC] whitespace-nowrap">
                        {purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : purchase.deliveryDate}
                      </TableCell>

                      {/* Return Status */}
                      <TableCell>
                        <div className="flex flex-col">
                          <StatusBadge status={returnInfo.badgeStatus} size="small" />
                          <span className="text-[10px] text-slate-500 dark:text-[#A9B0BC] mt-0.5">
                            {returnInfo.label}
                          </span>
                        </div>
                      </TableCell>

                      {/* Warranty Status */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-800 dark:text-[#F5F7FA]">
                            {warrantyInfo.badgeStatus !== 'neutral' ? 'Active' : 'No Warranty'}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-[#747C89] mt-0.5">
                            {warrantyInfo.label}
                          </span>
                        </div>
                      </TableCell>

                      {/* Lifecycle Status */}
                      <TableCell>
                        <StatusBadge status={lifecycle.badgeStatus} size="small" />
                      </TableCell>

                      {/* Row Action: View + Dropdown for Edit & Delete */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="small"
                            className="text-xs py-1 px-2.5"
                            onClick={() => navigate(`/app/purchases/${purchase.id}`)}
                          >
                            View
                          </Button>
                          <Dropdown
                            align="right"
                            trigger={
                              <button
                                type="button"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#1C2028] transition-colors"
                                aria-label="More actions"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            }
                          >
                            <DropdownItem
                              icon={Edit2}
                              onClick={() => {
                                setEditingPurchase(purchase);
                                setEditFormData({
                                  name: purchase.name || '',
                                  merchant: purchase.merchant || '',
                                  price: purchase.price || '',
                                  orderId: purchase.orderId || '',
                                  category: purchase.category || 'Electronics',
                                });
                              }}
                            >
                              Edit Item
                            </DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem
                              icon={Trash2}
                              danger
                              onClick={() => setDeletingPurchase(purchase)}
                            >
                              Delete
                            </DropdownItem>
                          </Dropdown>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500 dark:text-[#A9B0BC]">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredPurchases.length)} of {filteredPurchases.length} purchases
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="small"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    icon={ChevronLeft}
                  >
                    Previous
                  </Button>
                  <span className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="small"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    icon={ChevronRight}
                    iconPosition="right"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="No purchases found"
            description={
              searchQuery || statusFilter !== 'All' || categoryFilter !== 'All Categories'
                ? "No items match your active search and filter criteria. Try resetting filters."
                : "Add your first purchase to start tracking returns, refunds, warranties and documents."
            }
            action={
              <Link to="/app/purchases/new">
                <Button variant="primary" size="small" icon={Plus}>
                  Add Purchase
                </Button>
              </Link>
            }
          />
        )}
      </div>

      {/* 19. RESPONSIVE MOBILE CARD VIEW (Phone Screens) */}
      <div className="md:hidden space-y-3">
        {filteredPurchases.length > 0 ? (
          paginatedPurchases.map((purchase) => {
            const returnInfo = getReturnInfo(purchase);
            const warrantyInfo = getWarrantyInfo(purchase);
            const lifecycle = getLifecycleStatus(purchase);

            return (
              <Card key={purchase.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#1C2028] flex items-center justify-center font-bold text-slate-700 dark:text-[#F5F7FA] text-xs shrink-0">
                      {getInitials(purchase.name)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-[#F5F7FA]">{purchase.name}</h4>
                      <span className="text-[11px] text-slate-400 dark:text-[#747C89]">{purchase.merchant} • {purchase.orderId || purchase.category}</span>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-[#F5F7FA]">
                    {formatINR(purchase.price)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-[#22262F]">
                  <div>
                    <span className="text-slate-400 dark:text-[#747C89] block text-[10px]">Return</span>
                    <span className="font-medium text-slate-800 dark:text-[#F5F7FA]">{returnInfo.label}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-[#747C89] block text-[10px]">Warranty</span>
                    <span className="font-medium text-slate-800 dark:text-[#F5F7FA]">{warrantyInfo.label}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#22262F]">
                  <StatusBadge status={lifecycle.badgeStatus} size="small" />
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => navigate(`/app/purchases/${purchase.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      onClick={() => {
                        setEditingPurchase(purchase);
                        setEditFormData({
                          name: purchase.name || '',
                          merchant: purchase.merchant || '',
                          price: purchase.price || '',
                          orderId: purchase.orderId || '',
                          category: purchase.category || 'Electronics',
                        });
                      }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      onClick={() => setDeletingPurchase(purchase)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon={Inbox}
            title="No purchases found"
            description="No items match your active search or filters."
            action={
              <Link to="/app/purchases/new">
                <Button variant="primary" size="small" icon={Plus}>
                  Add Purchase
                </Button>
              </Link>
            }
          />
        )}
      </div>

      {/* Edit Purchase Modal */}
      {editingPurchase && (
        <Modal
          isOpen={!!editingPurchase}
          onClose={() => setEditingPurchase(null)}
          title="Edit Purchase Record"
          description="Update the details or pricing of your tracked purchase"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updatePurchase(editingPurchase.id, {
                name: editFormData.name,
                merchant: editFormData.merchant,
                price: Number(editFormData.price) || 0,
                orderId: editFormData.orderId,
                category: editFormData.category,
              });
              setEditingPurchase(null);
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
                onClick={() => setEditingPurchase(null)}
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
      {deletingPurchase && (
        <Modal
          isOpen={!!deletingPurchase}
          onClose={() => setDeletingPurchase(null)}
          title="Delete Purchase Record"
          description="Are you sure you want to permanently remove this purchase from your vault?"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                You are about to delete <strong>{deletingPurchase.name}</strong> (₹{deletingPurchase.price?.toLocaleString('en-IN')}). This will remove any associated return deadlines, warranties, and refund tracking for this order.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#22262F]">
              <Button
                variant="ghost"
                size="small"
                type="button"
                onClick={() => setDeletingPurchase(null)}
              >
                Keep Item
              </Button>
              <Button
                variant="danger"
                size="small"
                type="button"
                onClick={() => {
                  deletePurchase(deletingPurchase.id);
                  setDeletingPurchase(null);
                  addToast({
                    title: 'Purchase Deleted',
                    message: `${deletingPurchase.name} was removed from your ledger.`,
                    type: 'info',
                  });
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
