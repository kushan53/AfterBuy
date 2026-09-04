import React from 'react';
import { Badge } from './Badge';

/**
 * StatusBadge maps AfterBuy's domain states cleanly into consistent semantic badges
 */
export const StatusBadge = ({ status, size = 'medium', className }) => {
  const statusConfig = {
    // Return States
    'return-eligible': { label: 'Return Eligible', variant: 'success', dot: true },
    'return-expiring': { label: 'Return Expiring', variant: 'warning', dot: true },
    'return-expired': { label: 'Return Expired', variant: 'neutral', dot: false },

    // Return Progress States
    'return-requested': { label: 'Return Requested', variant: 'info', dot: true },
    'return-picked-up': { label: 'Picked Up', variant: 'purple', dot: true },

    // Refund States
    'refund-pending': { label: 'Refund Pending', variant: 'warning', dot: true },
    'refund-received': { label: 'Refund Received', variant: 'success', dot: false },
    'refund-overdue': { label: 'Refund Overdue', variant: 'danger', dot: true },

    // Warranty States
    'warranty-active': { label: 'Warranty Active', variant: 'info', dot: true },
    'warranty-expiring': { label: 'Warranty Expiring', variant: 'warning', dot: true },
    'warranty-expired': { label: 'Warranty Expired', variant: 'neutral', dot: false },

    // General States
    'delivered': { label: 'Delivered', variant: 'neutral', dot: false },
    'action-required': { label: 'Action Required', variant: 'danger', dot: true },
  };

  const key = status?.toLowerCase()?.replace(/\s+/g, '-');
  const config = statusConfig[key] || { label: status, variant: 'neutral', dot: false };

  return (
    <Badge variant={config.variant} size={size} dot={config.dot} className={className}>
      {config.label}
    </Badge>
  );
};
