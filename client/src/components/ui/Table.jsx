import React from 'react';
import { cn } from '../../utils/cn';

export const Table = ({ className, containerClassName, children, ...props }) => (
  <div className={cn("w-full min-w-0 overflow-x-auto rounded-xl border border-slate-200/80 dark:border-[#292E38] bg-white dark:bg-[#171A21] [-webkit-overflow-scrolling:touch]", containerClassName)}>
    <table className={cn("w-full text-left text-xs border-collapse min-w-[640px]", className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ className, children, ...props }) => (
  <thead className={cn("bg-slate-50/75 dark:bg-[#13161C] border-b border-slate-200/80 dark:border-[#292E38] text-slate-500 dark:text-[#A9B0BC] uppercase tracking-wider font-semibold text-[11px]", className)} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ className, children, ...props }) => (
  <tbody className={cn("divide-y divide-slate-100 dark:divide-[#22262F] text-slate-700 dark:text-[#F5F7FA] font-normal", className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ className, hoverable = true, children, ...props }) => (
  <tr className={cn("transition-colors", hoverable && "hover:bg-slate-50/60 dark:hover:bg-[#1C2028]/80", className)} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ className, children, ...props }) => (
  <th className={cn("px-4 py-3 font-semibold", className)} {...props}>
    {children}
  </th>
);

export const TableCell = ({ className, children, ...props }) => (
  <td className={cn("px-4 py-3.5 align-middle text-slate-700 dark:text-[#F5F7FA]", className)} {...props}>
    {children}
  </td>
);
