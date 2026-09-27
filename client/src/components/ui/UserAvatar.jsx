import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

/**
 * Premium Executive User Avatar with bulletproof fallback initials monogram.
 * Eliminates browser broken-image icons and text clipping.
 */
export const UserAvatar = ({
  user,
  name: propName,
  avatar: propAvatar,
  size = 'sm', // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape = 'circle', // 'circle' | 'rounded'
  className = '',
  ring = true,
  interactive = false,
  showStatus = false,
  statusColor = 'bg-emerald-500',
}) => {
  const [imgError, setImgError] = useState(false);

  const rawName = propName || user?.name || '';
  const rawAvatar = propAvatar || user?.avatar || '';

  // Reset error when avatar source changes
  useEffect(() => {
    setImgError(false);
  }, [rawAvatar]);

  // Compute initials (e.g. "Kushan Garg" -> "KG", "Kushan" -> "KU", "" -> "AB")
  const getInitials = (fullName) => {
    if (!fullName) return 'AB';
    const clean = fullName.trim();
    if (!clean) return 'AB';
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(rawName);

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm font-semibold',
    lg: 'h-14 w-14 text-lg font-bold',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 text-2xl sm:text-3xl font-extrabold',
  }[size] || 'h-8 w-8 text-xs';

  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  const ringClasses = ring
    ? size === 'xl'
      ? 'border-4 border-white dark:border-[#171A21] shadow-lg'
      : 'ring-2 ring-blue-500/25 dark:ring-blue-400/20 shadow-xs'
    : '';

  const interactiveClasses = interactive
    ? 'hover:ring-blue-500/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer'
    : '';

  const isValidUrl =
    typeof rawAvatar === 'string' &&
    rawAvatar.trim().length > 4 &&
    (rawAvatar.startsWith('http://') ||
      rawAvatar.startsWith('https://') ||
      rawAvatar.startsWith('data:image/'));

  const canShowImage = isValidUrl && !imgError;

  return (
    <div
      role="img"
      aria-label={rawName ? `${rawName}'s avatar` : 'User profile'}
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden',
        shapeClasses,
        sizeClasses,
        ringClasses,
        interactiveClasses,
        'bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white font-bold tracking-tight',
        className
      )}
    >
      {canShowImage ? (
        <img
          src={rawAvatar}
          alt=""
          aria-hidden="true"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="leading-none">{initials}</span>
      )}

      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-[#11141A]',
            statusColor,
            size === 'xs' ? 'h-1.5 w-1.5' : size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
