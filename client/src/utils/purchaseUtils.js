/**
 * AFTERBUY FORMAT & CALCULATION UTILITIES
 */

export const formatINR = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

/**
 * Return Window calculation
 * @returns { label: string, status: string, isUrgent: boolean }
 */
export const getReturnInfo = (purchase) => {
  // If return has already been requested or processed
  if (purchase.returnStatus === 'return_requested') {
    return { label: 'In progress', badgeStatus: 'return-requested' };
  }
  if (purchase.returnStatus === 'picked_up') {
    return { label: 'Picked up', badgeStatus: 'return-picked-up' };
  }
  if (purchase.returnStatus === 'returned') {
    return { label: 'Returned', badgeStatus: 'refund-received' };
  }
  if (purchase.returnStatus === 'no_return' || purchase.returnWindowDays === 0) {
    return { label: 'No return', badgeStatus: 'neutral' };
  }
  if (purchase.returnStatus === 'expired') {
    return { label: 'Expired', badgeStatus: 'return-expired' };
  }

  // Calculate live days if returnDeadline exists (ISO YYYY-MM-DD or readable)
  if (purchase.deadlineDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(purchase.deadlineDate);
    deadline.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Expired', badgeStatus: 'return-expired' };
    }
    if (diffDays === 0) {
      return { label: 'Ends today', badgeStatus: 'return-expiring', isUrgent: true };
    }
    if (diffDays === 1) {
      return { label: 'Tomorrow', badgeStatus: 'return-expiring', isUrgent: true };
    }
    return { label: `${diffDays} days left`, badgeStatus: 'return-eligible', isUrgent: false };
  }

  // Fallback to deadlineText if preset
  if (purchase.deadlineText) {
    const isUrgent = purchase.deadlineText === 'Tomorrow' || purchase.deadlineText === 'Ends today';
    return {
      label: purchase.deadlineText,
      badgeStatus: isUrgent ? 'return-expiring' : 'return-eligible',
      isUrgent,
    };
  }

  return { label: 'Return Eligible', badgeStatus: 'return-eligible' };
};

/**
 * Warranty Status calculation
 */
export const getWarrantyInfo = (purchase) => {
  if (!purchase.warrantyActive && !purchase.warrantyExpiry) {
    return { label: 'No Warranty', badgeStatus: 'neutral' };
  }

  if (purchase.warrantyDaysLeft != null) {
    if (purchase.warrantyDaysLeft <= 0) {
      return { label: 'Expired', badgeStatus: 'warranty-expired' };
    }
    if (purchase.warrantyDaysLeft <= 30) {
      return { label: `${purchase.warrantyDaysLeft} days left`, badgeStatus: 'warranty-expiring' };
    }
    if (purchase.warrantyDaysLeft < 365) {
      const months = Math.round(purchase.warrantyDaysLeft / 30);
      return { label: `${months} months left`, badgeStatus: 'warranty-active' };
    }
    const years = (purchase.warrantyDaysLeft / 365).toFixed(1);
    return { label: `${years} yrs left`, badgeStatus: 'warranty-active' };
  }

  return { label: 'Active', badgeStatus: 'warranty-active' };
};

/**
 * Lifecycle Purchase Status Badge determination
 */
export const getLifecycleStatus = (purchase) => {
  if (purchase.refund) {
    if (purchase.refund.status === 'refund-overdue') {
      return { label: 'Refund Overdue', badgeStatus: 'refund-overdue' };
    }
    if (purchase.refund.status === 'refund-pending') {
      return { label: 'Refund Pending', badgeStatus: 'refund-pending' };
    }
    if (purchase.refund.status === 'refund-received' || purchase.refund.settled) {
      return { label: 'Refunded', badgeStatus: 'refund-received' };
    }
  }

  if (purchase.returnStatus === 'return_requested') {
    return { label: 'Return Requested', badgeStatus: 'return-requested' };
  }
  if (purchase.returnStatus === 'picked_up') {
    return { label: 'Return In Progress', badgeStatus: 'return-picked-up' };
  }
  if (purchase.returnStatus === 'expiring') {
    return { label: 'Return Expiring', badgeStatus: 'return-expiring' };
  }
  if (purchase.returnStatus === 'eligible') {
    return { label: 'Return Eligible', badgeStatus: 'return-eligible' };
  }
  if (purchase.warrantyActive) {
    return { label: 'Warranty Active', badgeStatus: 'warranty-active' };
  }
  if (purchase.returnStatus === 'expired') {
    return { label: 'Completed', badgeStatus: 'neutral' };
  }

  return { label: 'Delivered', badgeStatus: 'neutral' };
};
