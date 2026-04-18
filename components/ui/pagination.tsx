'use client';
import React from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const { t } = useTranslation();
  const [showPerPageDropdown, setShowPerPageDropdown] = React.useState(false);
  const perPageOptions = React.useMemo(() => [10, 15, 20], []);

  const handlePerPageChange = (newPerPage: number) => {
    onItemsPerPageChange?.(newPerPage);
    onPageChange(1);
    setShowPerPageDropdown(false);
  };
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 bg-white w-full">
      <div className="flex items-center gap-3">
        <div className="flex items-center text-sm text-theme-neutral-8">
          <span className="font-medium text-theme-neutral-11">
            {startItem}-{endItem}
          </span>
          <span className="mx-1">{t('common.of', 'of')}</span>
          <span>{totalItems}</span>
        </div>
        <div className="h-5 w-px bg-theme-neutral-5" />
        {totalPages > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-md border border-theme-neutral-5 bg-white p-0 text-theme-neutral-8 hover:bg-theme-neutral-2"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-3 py-1 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? 'outline' : 'ghost'}
                    size="sm"
                    className={cn(
                      'h-8 min-w-8 rounded-md px-2 text-sm',
                      currentPage === page
                        ? 'border-theme-neutral-5 bg-theme-neutral-2 text-theme-neutral-11'
                        : 'text-theme-neutral-8 hover:bg-theme-neutral-2'
                    )}
                    onClick={() => onPageChange(page as number)}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-md border border-theme-neutral-5 bg-white p-0 text-theme-neutral-8 hover:bg-theme-neutral-2"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-theme-neutral-8">
          <span>{t('common.rowsPerPage', 'Rows per page')}</span>
          <div className="relative">
            <button
              type="button"
              className="flex min-w-[72px] items-center justify-between gap-2 rounded-md border border-theme-neutral-5 bg-white px-3 py-1.5 text-sm text-theme-neutral-11 transition-colors hover:bg-theme-neutral-2"
              onClick={() => setShowPerPageDropdown(prev => !prev)}
            >
              <span className="font-medium">{itemsPerPage || 10}</span>
              <ChevronDown className="h-4 w-4 text-theme-neutral-7" />
            </button>
            {showPerPageDropdown && (
              <div className="absolute bottom-full right-0 mb-2 w-28 overflow-hidden rounded-md border border-theme-neutral-5 bg-white shadow-lg z-50">
                {perPageOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handlePerPageChange(option)}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-sm text-theme-neutral-11 hover:bg-theme-neutral-2',
                      (itemsPerPage || 10) === option &&
                        'bg-theme-neutral-2 font-medium'
                    )}
                  >
                    <span>{option}</span>
                    {(itemsPerPage || 10) === option && (
                      <span className="text-theme-main">•</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
