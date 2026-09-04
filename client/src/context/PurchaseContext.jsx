import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { INITIAL_PURCHASES } from '../data/mockPurchases';

const PurchaseContext = createContext(null);
const STORAGE_KEY = 'afterbuy_purchases_v1';

export const PurchaseProvider = ({ children }) => {
  // LocalStorage persistence with INITIAL_PURCHASES fallback
  const [purchases, setPurchases] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading purchases from localStorage:', e);
    }
    return INITIAL_PURCHASES;
  });

  // Keep localStorage synchronized whenever purchases change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
    } catch (e) {
      console.error('Error saving purchases to localStorage:', e);
    }
  }, [purchases]);

  // 1. Approaching Return Deadlines:
  // ONLY products that are eligible or expiring (NOT yet requested or returned)
  const approachingReturnItems = useMemo(() => {
    return purchases.filter(
      (p) => p.returnStatus === 'eligible' || p.returnStatus === 'expiring'
    );
  }, [purchases]);

  // 2. Pending & In-Flight Refunds:
  // ONLY refunds that are NOT settled ('refund-pending' or 'refund-overdue')
  const pendingRefundsList = useMemo(() => {
    return purchases
      .filter((p) => p.refund && !p.refund.settled && p.refund.status !== 'refund-received')
      .map((p) => ({
        purchaseId: p.id,
        name: p.name,
        merchant: p.merchant,
        ...p.refund,
      }));
  }, [purchases]);

  // 3. Settled / Received Refunds:
  const settledRefundsList = useMemo(() => {
    return purchases
      .filter((p) => p.refund && (p.refund.settled || p.refund.status === 'refund-received'))
      .map((p) => ({
        purchaseId: p.id,
        name: p.name,
        merchant: p.merchant,
        ...p.refund,
      }));
  }, [purchases]);

  // 4. Warranties Expiring Soon:
  const expiringWarrantiesList = useMemo(() => {
    return purchases.filter((p) => p.warrantyActive && p.isWarrantyExpiringSoon);
  }, [purchases]);

  // 5. Total Active Warranties:
  const totalActiveWarranties = useMemo(() => {
    return purchases.filter((p) => p.warrantyActive).length;
  }, [purchases]);

  // 6. Action Required Calculation (Dynamic):
  const urgentReturns = useMemo(() => {
    return approachingReturnItems.filter((p) => p.isUrgentReturn || p.returnStatus === 'expiring');
  }, [approachingReturnItems]);

  const overdueRefunds = useMemo(() => {
    return pendingRefundsList.filter((r) => r.isOverdue && !r.settled);
  }, [pendingRefundsList]);

  const urgentCount = urgentReturns.length + overdueRefunds.length;

  // 7. Dynamic Summary Card Metrics:
  const totalPendingRefundAmount = useMemo(() => {
    return pendingRefundsList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [pendingRefundsList]);

  const totalRefundedAmount = useMemo(() => {
    return settledRefundsList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [settledRefundsList]);

  const activeReturnsCount = useMemo(() => {
    return purchases.filter(
      (p) =>
        p.returnStatus === 'return_requested' ||
        p.returnStatus === 'picked_up' ||
        p.returnStatus === 'in_transit'
    ).length;
  }, [purchases]);

  // User Actions:
  const requestReturn = (purchaseId) => {
    setPurchases((prev) =>
      prev.map((p) => {
        if (p.id === purchaseId) {
          return {
            ...p,
            returnStatus: 'return_requested',
            isUrgentReturn: false,
            refund: {
              id: `ref-auto-${Date.now()}`,
              amount: p.price,
              expectedDate: 'In 5 days',
              status: 'refund-pending',
              isOverdue: false,
              settled: false,
            },
          };
        }
        return p;
      })
    );
  };

  const markRefundReceived = (refundId) => {
    setPurchases((prev) =>
      prev.map((p) => {
        if (p.refund && p.refund.id === refundId) {
          return {
            ...p,
            refund: {
              ...p.refund,
              status: 'refund-received',
              settled: true,
              isOverdue: false,
            },
          };
        }
        return p;
      })
    );
  };

  const addPurchase = (newPurchase) => {
    const created = {
      id: `pur-${Date.now()}`,
      ...newPurchase,
    };
    setPurchases((prev) => [created, ...prev]);
    return created;
  };

  const updatePurchase = (id, updatedFields) => {
    setPurchases((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedFields,
          };
        }
        return p;
      })
    );
  };

  const deletePurchase = (id) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  };

  const value = {
    purchases,
    approachingReturnItems,
    pendingRefundsList,
    settledRefundsList,
    expiringWarrantiesList,
    totalActiveWarranties,
    urgentReturns,
    overdueRefunds,
    urgentCount,
    totalPendingRefundAmount,
    totalRefundedAmount,
    activeReturnsCount,
    requestReturn,
    markRefundReceived,
    addPurchase,
    updatePurchase,
    deletePurchase,
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchases must be used within a PurchaseProvider');
  }
  return context;
};
