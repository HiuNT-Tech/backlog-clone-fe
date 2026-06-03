'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* ── Base Block ─────────────────────────────────────────────────── */

interface SkeletonBlockProps {
  className?: string;
}

const SkeletonBlock: React.FC<SkeletonBlockProps> = ({ className }) => (
  <div className={cn('animate-pulse rounded bg-theme-neutral-4', className)} />
);

/* ── Page Skeleton ──────────────────────────────────────────────── */

/** Full-width page placeholder (heading + paragraph + grid). */
export const PageSkeleton: React.FC = () => (
  <div className="w-full px-6 py-6 space-y-6">
    <SkeletonBlock className="h-7 w-48" />
    <SkeletonBlock className="h-4 w-96" />
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-24" />
      ))}
    </div>
  </div>
);

/* ── Detail Skeleton ────────────────────────────────────────────── */

/** Detail page placeholder (breadcrumb + title + body + side fields). */
export const DetailSkeleton: React.FC = () => (
  <div className="w-full animate-pulse px-6 py-6">
    <SkeletonBlock className="h-6 w-40 mb-4" />
    <SkeletonBlock className="h-8 w-3/4 mb-6" />
    <SkeletonBlock className="h-40 mb-4" />
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-10" />
      ))}
    </div>
  </div>
);

/* ── Table Skeleton ─────────────────────────────────────────────── */

interface TableSkeletonProps {
  /** Number of placeholder rows (default: 5) */
  rows?: number;
  /** Number of placeholder columns (default: 4) */
  cols?: number;
}

/** Table placeholder with header row + data rows. */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="w-full space-y-3">
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBlock key={`h-${i}`} className="h-5 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4">
        {Array.from({ length: cols }).map((_, c) => (
          <SkeletonBlock key={`${r}-${c}`} className="h-10 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

/* ── Card Skeleton ──────────────────────────────────────────────── */

/** Small card placeholder for Kanban-style lists. */
export const CardSkeleton: React.FC = () => (
  <div className="rounded-lg border border-theme-neutral-4 p-4 space-y-3">
    <SkeletonBlock className="h-4 w-3/4" />
    <SkeletonBlock className="h-3 w-1/2" />
    <div className="flex gap-2">
      <SkeletonBlock className="h-6 w-6 rounded-full" />
      <SkeletonBlock className="h-6 w-16" />
    </div>
  </div>
);
