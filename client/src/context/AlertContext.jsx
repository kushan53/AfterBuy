import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePurchases } from './PurchaseContext';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ui/Toast';

const AlertContext = createContext(null);

const NOTIFIED_CACHE_KEY = 'afterbuy_sentinel_notified_cache';

export const AlertProvider = ({ children }) => {
  const { urgentReturns = [], overdueRefunds = [], expiringWarrantiesList = [] } = usePurchases();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [permission, setPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const notifiedCacheRef = useRef(new Set());

  // Initialize notified cache from session so we don't repeat alerts in the same session
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(NOTIFIED_CACHE_KEY);
      if (raw) {
        notifiedCacheRef.current = new Set(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveNotifiedCache = () => {
    try {
      sessionStorage.setItem(
        NOTIFIED_CACHE_KEY,
        JSON.stringify(Array.from(notifiedCacheRef.current))
      );
    } catch (e) {
      // ignore
    }
  };

  // Request browser desktop notification permission (silent visual notifications)
  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      addToast({
        title: 'Not Supported',
        message: 'Your browser does not support desktop notifications.',
        type: 'error',
      });
      return 'unsupported';
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        addToast({
          title: 'Real-Time Desktop Alerts Active',
          message: 'Silent visual notifications will now alert you to urgent return windows & overdue refunds.',
          type: 'success',
        });
      } else if (res === 'denied') {
        addToast({
          title: 'Notifications Blocked',
          message: 'Please allow notification permissions in your browser address bar to receive desktop alerts.',
          type: 'error',
        });
      }
      return res;
    } catch (e) {
      console.warn('Could not request notification permission:', e);
      return 'denied';
    }
  };

  // Dispatch a native browser OS notification (silent: true, no audio)
  const dispatchDesktopNotification = useCallback((title, options = {}) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      const notif = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: options.tag || 'afterbuy-alert',
        requireInteraction: options.requireInteraction || false,
        silent: true, // Always completely silent
        ...options,
      });

      notif.onclick = () => {
        window.focus();
        if (options.url) {
          window.location.href = options.url;
        }
        notif.close();
      };
    } catch (e) {
      console.warn('Desktop notification dispatch error:', e);
    }
  }, []);

  // Trigger test alert on demand (silent visual-only)
  const triggerTestAlert = () => {
    if (urgentReturns.length > 0) {
      const top = urgentReturns[0];
      addToast({
        title: `🚨 Urgent Return: ${top.name}`,
        message: `${top.merchant} return window closes ${top.deadlineText ? top.deadlineText.toLowerCase() : 'in 2 days'}. Save ₹${top.price?.toLocaleString('en-IN') || 0}.`,
        type: 'warning',
      });

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        dispatchDesktopNotification(`🚨 Return Window Ending: ${top.name}`, {
          body: `${top.merchant} return window closes ${top.deadlineText ? top.deadlineText.toLowerCase() : 'in 2 days'}! Save ₹${top.price?.toLocaleString('en-IN') || 0}.`,
          tag: `alert-${top.id}-${Date.now()}`,
          url: '/app/returns',
        });
      }
    } else {
      addToast({
        title: '🚨 Live Sentinel Alert Active',
        message: 'Silent visual alert tested! 48h return windows and overdue refunds are monitored in real time.',
        type: 'warning',
      });

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        dispatchDesktopNotification('🚨 AfterBuy Real-Time Sentinel Active', {
          body: 'Real-time monitor active: Return deadlines and overdue merchant refunds will alert you visually.',
          tag: `test-alert-${Date.now()}`,
        });
      }
    }
  };

  // Active Real-Time Sentinel Monitoring Loop (Visual-Only)
  useEffect(() => {
    if (!isAuthenticated) return;

    const runSentinelCheck = () => {
      // 1. Check Urgent Returns (< 48h)
      urgentReturns.forEach((item) => {
        const cacheKey = `urgent-ret-${item.id}`;
        if (!notifiedCacheRef.current.has(cacheKey)) {
          notifiedCacheRef.current.add(cacheKey);
          saveNotifiedCache();

          dispatchDesktopNotification(`🚨 Return Window Ending: ${item.name}`, {
            body: `${item.merchant} return window closes ${item.deadlineText ? item.deadlineText.toLowerCase() : 'soon'}! Save ₹${item.price?.toLocaleString('en-IN') || 0}.`,
            url: '/app/returns',
            tag: cacheKey,
          });

          addToast({
            title: `Urgent Return: ${item.name}`,
            message: `Return window closes ${item.deadlineText ? item.deadlineText.toLowerCase() : 'soon'}. Request return now to save ₹${item.price?.toLocaleString('en-IN') || 0}.`,
            type: 'warning',
          });
        }
      });

      // 2. Check Overdue Refunds
      overdueRefunds.forEach((ref) => {
        const cacheKey = `overdue-ref-${ref.id || ref.purchaseId}`;
        if (!notifiedCacheRef.current.has(cacheKey)) {
          notifiedCacheRef.current.add(cacheKey);
          saveNotifiedCache();

          dispatchDesktopNotification(`⚠️ Refund Overdue: ₹${ref.amount?.toLocaleString('en-IN')}`, {
            body: `${ref.merchant || 'Store'} has exceeded the SLA refund timeline for ${ref.name || 'your order'}.`,
            url: '/app/refunds',
            tag: cacheKey,
          });

          addToast({
            title: `Overdue Refund: ${ref.merchant || 'Store'}`,
            message: `₹${ref.amount?.toLocaleString('en-IN')} is overdue. View dispute details in Refunds desk.`,
            type: 'error',
          });
        }
      });
    };

    // Run promptly once data is ready
    const timer = setTimeout(runSentinelCheck, 300);

    // Re-check periodically every 45 seconds
    const interval = setInterval(runSentinelCheck, 45000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isAuthenticated, urgentReturns, overdueRefunds, dispatchDesktopNotification, addToast]);

  return (
    <AlertContext.Provider
      value={{
        permission,
        requestPermission,
        dispatchDesktopNotification,
        triggerTestAlert,
        urgentCount: urgentReturns.length + overdueRefunds.length,
        urgentReturns,
        overdueRefunds,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
