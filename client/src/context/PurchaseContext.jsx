import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from './AuthContext';

const PurchaseContext = createContext(null);

const normalizePurchase = (p) => ({
  ...p,
  id: p._id || p.id,
});

export const PurchaseProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Clear any legacy mock purchases left in localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('afterbuy_purchases_v1');
    } catch (e) {
      // ignore
    }
  }, []);

  // Fetch only REAL purchases from MongoDB backend
  useEffect(() => {
    const fetchPurchases = async () => {
      const currentToken = localStorage.getItem('afterbuy_auth_token');
      if (!currentToken) {
        setPurchases([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await apiRequest('/purchases');
        if (res?.success && Array.isArray(res.data)) {
          setPurchases(res.data.map(normalizePurchase));
        } else {
          setPurchases([]);
        }
      } catch (err) {
        console.warn('Could not fetch purchases from backend:', err.message);
        setPurchases([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated || token) {
      fetchPurchases();
    } else {
      setPurchases([]);
    }
  }, [token, isAuthenticated]);

  // 1. Approaching Return Deadlines:
  const approachingReturnItems = useMemo(() => {
    return purchases.filter(
      (p) => p.returnStatus === 'eligible' || p.returnStatus === 'expiring'
    );
  }, [purchases]);

  // 2. Pending & In-Flight Refunds:
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
    return pendingRefundsList.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [pendingRefundsList]);

  const totalRefundedAmount = useMemo(() => {
    return settledRefundsList.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [settledRefundsList]);

  const activeReturnsCount = useMemo(() => {
    return purchases.filter(
      (p) =>
        p.returnStatus === 'return_requested' ||
        p.returnStatus === 'picked_up' ||
        p.returnStatus === 'in_transit'
    ).length;
  }, [purchases]);

  // Real Database Operations
  const addPurchase = async (newPurchase) => {
    try {
      const res = await apiRequest('/purchases', {
        method: 'POST',
        body: JSON.stringify(newPurchase),
      });

      if (res?.data) {
        const savedItem = normalizePurchase(res.data);
        setPurchases((prev) => [savedItem, ...prev]);
        return savedItem;
      }
    } catch (err) {
      console.error('Failed to create purchase in database:', err);
      throw err;
    }
  };

  const updatePurchase = async (id, updatedFields) => {
    try {
      const res = await apiRequest(`/purchases/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFields),
      });

      if (res?.data) {
        const updated = normalizePurchase(res.data);
        setPurchases((prev) =>
          prev.map((p) => (p.id === id || p._id === id ? updated : p))
        );
        return updated;
      }
    } catch (err) {
      console.error('Failed to update purchase in database:', err);
      throw err;
    }
  };

  const deletePurchase = async (id) => {
    try {
      await apiRequest(`/purchases/${id}`, {
        method: 'DELETE',
      });
      setPurchases((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    } catch (err) {
      console.error('Failed to delete purchase from database:', err);
      throw err;
    }
  };

  const requestReturn = async (purchaseId, reason) => {
    try {
      const res = await apiRequest(`/purchases/${purchaseId}/return`, {
        method: 'POST',
        body: JSON.stringify({ reason: reason || 'Customer return requested' }),
      });
      if (res?.data) {
        const updated = normalizePurchase(res.data);
        setPurchases((prev) =>
          prev.map((p) => (p.id === purchaseId || p._id === purchaseId ? updated : p))
        );
        return updated;
      }
    } catch (err) {
      console.error('Failed to request return in database:', err);
      throw err;
    }
  };

  const markRefundReceived = async (refundOrPurchaseId) => {
    const target = purchases.find(
      (p) =>
        (p.refund && p.refund.id === refundOrPurchaseId) ||
        p.id === refundOrPurchaseId ||
        p._id === refundOrPurchaseId
    );

    const purchaseId = target ? (target._id || target.id) : refundOrPurchaseId;

    try {
      const res = await apiRequest(`/purchases/${purchaseId}/settle-refund`, {
        method: 'POST',
      });
      if (res?.data) {
        const updated = normalizePurchase(res.data);
        setPurchases((prev) =>
          prev.map((p) => (p.id === purchaseId || p._id === purchaseId ? updated : p))
        );
        return updated;
      }
    } catch (err) {
      console.error('Failed to settle refund in database:', err);
      throw err;
    }
  };

  const value = {
    purchases,
    isLoading,
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
