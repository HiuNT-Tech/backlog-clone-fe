'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Pagination } from './pagination';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

export interface TableColumn<T = any> {
  key: string;
  title: string | React.ReactNode;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  className?: string;
  children?: TableColumn<T>[];
}

export interface CustomTableProps<T = any> {
  columns: TableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  error?: boolean;
  rowKey?: string | ((record: T) => string);
  className?: string;
  maxHeight?: string;
  /**
   * Enable horizontal scroll only within the table.
   * When true, the table will have its own horizontal scrollbar
   * instead of affecting the entire page layout.
   * This is useful when you have many columns and want to prevent text wrapping.
   */
  horizontalScroll?: boolean;

  // Pagination props
  pagination?:
    | {
        current: number;
        total: number;
        pageSize: number;
        showSizeChanger?: boolean;
        showQuickJumper?: boolean;
        showTotal?: boolean;
        rightAreaRender?: () => React.ReactNode;
        onChange?: (page: number, pageSize?: number) => void;
        onShowSizeChange?: (size: number) => void;
      }
    | false;

  // Loading and error states
  emptyText?: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  onRetry?: () => void;

  // Row props
  onRow?: (
    record: T,
    index: number
  ) => {
    onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
    onDoubleClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
    onContextMenu?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
    className?: string;
  };
  actions?: {
    icon: string;
    title: string;
    onClick: (record: T, index: number) => void;
    key?: string | number;
    disabled?: boolean | ((record: T, index: number) => boolean);
    hidden?: (record: T, index: number) => boolean;
  }[];
}

const TableLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-8 h-8 border-2 border-gray-200 border-t-theme-main rounded-full animate-spin"></div>
    <p className="mt-4 text-sm text-gray-500">{text}</p>
  </div>
);

const TableLoadingOverlay: React.FC<{ text?: string }> = ({
  text = 'Loading...',
}) => (
  <div className="absolute inset-0 bg-white opacity-50 flex flex-col items-center justify-center z-10">
    <div className="w-8 h-8 border-2 border-gray-200 border-t-theme-main rounded-full animate-spin"></div>
    <p className="mt-4 text-sm text-gray-500">{text}</p>
  </div>
);

const TableError: React.FC<{ text?: string; onRetry?: () => void }> = ({
  text = 'Error loading data',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <p className="text-sm text-red-500 mb-4">{text}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-theme-main text-white rounded-lg hover:bg-theme-hover transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);

const TableEmpty: React.FC<{ text?: React.ReactNode }> = ({
  text = 'No data',
}) => (
  <div className="flex items-center justify-center py-16">
    <p className="text-sm text-gray-500">{text}</p>
  </div>
);

const IconButton = ({
  src,
  onClick,
  title,
  disabled = false,
}: {
  src: string;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={e => {
        e.stopPropagation();
        if (!disabled) {
          onClick();
        }
      }}
      disabled={disabled}
      className={cn(
        'p-1 rounded-full',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:bg-theme-neutral-4'
      )}
      title={title}
    >
      <Image
        src={src}
        alt={title}
        width={20}
        height={20}
        className="w-5 h-5"
        style={{ filter: 'var(--theme-filter-main)' }}
      />
    </button>
  );
};

const CustomTable = <T extends Record<string, any>>({
  columns,
  dataSource,
  loading = false,
  error = false,
  rowKey = 'id',
  className,

  pagination,
  emptyText,
  loadingText = 'Loading...',
  errorText = 'Error loading data',
  onRetry,
  onRow,
  maxHeight,
  horizontalScroll = true,
  actions,
}: CustomTableProps<T>) => {
  const { t } = useTranslation();
  const [showPerPageDropdown, setShowPerPageDropdown] =
    React.useState<boolean>(false);
  const getRowKey = React.useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return String(rowKey(record));
      }
      return String(record[rowKey] ?? index);
    },
    [rowKey]
  );

  // Check if action column should be shown
  const hasActions = actions && actions.length > 0;
  // Create computed columns with action column if needed
  const computedColumns = React.useMemo(() => {
    if (!hasActions) return columns;

    return [
      ...columns,
      {
        key: 'actions',
        title: t('common.actions'),
        minWidth: '60px',
        align: 'center' as const,
        render: (value: any, record: T, index: number) => (
          <div className="flex items-center justify-center gap-2">
            {actions
              .filter(action => !action.hidden?.(record, index))
              .map((action, actionIndex) => {
                const isDisabled =
                  typeof action.disabled === 'function'
                    ? action.disabled(record, index)
                    : (action.disabled ?? false);
                return (
                  <IconButton
                    key={action.key ?? `${action.title}-${actionIndex}`}
                    src={action.icon}
                    onClick={() => action.onClick?.(record, index)}
                    title={action.title}
                    disabled={isDisabled}
                  />
                );
              })}
          </div>
        ),
      } as TableColumn<T>,
    ];
  }, [columns, hasActions, actions, t]);

  // Helper function to flatten columns (get all leaf columns)
  const flattenColumns = (cols: TableColumn<T>[]): TableColumn<T>[] => {
    const result: TableColumn<T>[] = [];
    cols.forEach(col => {
      if (col.children && col.children.length > 0) {
        result.push(...flattenColumns(col.children));
      } else {
        result.push(col);
      }
    });
    return result;
  };

  // Helper function to check if there are nested columns
  const hasNestedColumns = (cols: TableColumn<T>[]): boolean => {
    return cols.some(col => col.children && col.children.length > 0);
  };

  // Get flattened columns for rendering data rows
  const flattenedColumns = React.useMemo(
    () => flattenColumns(computedColumns),
    [computedColumns]
  );

  // Check if we have nested structure
  const isNested = React.useMemo(
    () => hasNestedColumns(computedColumns),
    [computedColumns]
  );

  const perPageOptions = React.useMemo(() => [10, 15, 20], []);

  const handlePerPageChange = (newPerPage: number) => {
    if (!pagination) return;
    pagination.onShowSizeChange?.(newPerPage);
    pagination.onChange?.(1, newPerPage);
    setShowPerPageDropdown(false);
  };

  return (
    <div
      className="flex flex-col gap-4"
      style={horizontalScroll ? { width: '100%', minWidth: 0 } : undefined}
    >
      {pagination && (
        <div className="flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-theme-neutral-11">
              {t('staff.table.serviceTitle')}
            </span>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-sm border border-theme-neutral-5 rounded-md bg-white shadow-sm hover:bg-theme-neutral-2 transition-colors"
                onClick={() => setShowPerPageDropdown(prev => !prev)}
              >
                {pagination.pageSize}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showPerPageDropdown && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-theme-neutral-5 rounded-md shadow-lg z-10">
                  {perPageOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handlePerPageChange(option)}
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm hover:bg-theme-neutral-2',
                        pagination.pageSize === option && 'bg-theme-neutral-2'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {pagination.rightAreaRender && pagination.rightAreaRender()}
        </div>
      )}
      <div
        className={cn(
          'bg-white rounded-[16px] shadow overflow-hidden border border-theme-neutral-5',
          className
        )}
        style={
          horizontalScroll ? { width: '100%', maxWidth: '100%' } : undefined
        }
      >
        {/* Table */}
        <div
          className={cn(
            'overflow-x-auto relative',
            horizontalScroll && 'table-horizontal-scroll'
          )}
        >
          <table
            className="border-collapse"
            style={
              horizontalScroll
                ? { width: 'max-content', minWidth: '100%' }
                : { width: '100%' }
            }
          >
            {/* Header */}
            <thead className="bg-[#F1F3F8]">
              {isNested ? (
                <>
                  {/* First row: parent columns */}
                  {/* Second row: child columns */}
                  <tr>
                    {computedColumns.map(column => {
                      if (column.children && column.children.length > 0) {
                        return column.children.map((child, childIndex) => (
                          <th
                            key={child.key}
                            className={cn(
                              'p-3 text-[14px] font-bold text-theme-neutral-11 border-b border-theme-neutral-5 relative whitespace-break-spaces',
                              horizontalScroll
                                ? 'whitespace-nowrap'
                                : 'whitespace-break-spaces',
                              child.align === 'left' && 'text-left',
                              child.align === 'center' && 'text-center',
                              child.align === 'right' && 'text-right',
                              child.width && `w-[${child.width}]`,
                              child.minWidth && `min-w-[${child.minWidth}]`,
                              child.maxWidth && `max-w-[${child.maxWidth}]`,
                              child.className
                            )}
                            style={{
                              width: child.width,
                              minWidth: horizontalScroll
                                ? child.minWidth || child.width
                                : undefined,
                            }}
                          >
                            {childIndex === 0 && (
                              <div className="absolute top-[50%] left-[0px] w-[1px] h-[20px] bg-[#ffffff] -translate-y-1/2"></div>
                            )}
                            {child.title}
                          </th>
                        ));
                      }
                      return null;
                    })}
                  </tr>
                </>
              ) : (
                <tr>
                  {computedColumns.map((column, index) => (
                    <th
                      key={column.key}
                      className={cn(
                        'p-3 text-[14px] font-bold text-theme-neutral-11 border-b border-theme-neutral-5 relative whitespace-break-spaces',
                        horizontalScroll
                          ? 'whitespace-nowrap'
                          : 'whitespace-break-spaces',
                        column.align === 'left' && 'text-left',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.width && `w-[${column.width}]`,
                        column.minWidth && `min-w-[${column.minWidth}]`,
                        column.maxWidth && `max-w-[${column.maxWidth}]`,
                        column.className
                      )}
                      style={{
                        width: column.width,
                        minWidth: column.minWidth || column.width,
                      }}
                    >
                      {index !== 0 && (
                        <div className="absolute top-[50%] left-[0px] w-[1px] h-[20px] bg-[#ffffff] -translate-y-1/2"></div>
                      )}
                      {column.title}
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            <tbody
              className={cn(
                maxHeight && `max-h-[${maxHeight}] overflow-y-auto`
              )}
              style={maxHeight ? { maxHeight } : undefined}
            >
              {loading && dataSource.length === 0 ? (
                <tr>
                  <td colSpan={flattenedColumns.length}>
                    <TableLoading text={loadingText} />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={flattenedColumns.length}>
                    <TableError text={errorText} onRetry={onRetry} />
                  </td>
                </tr>
              ) : dataSource.length === 0 ? (
                <tr>
                  <td colSpan={flattenedColumns.length}>
                    <TableEmpty
                      text={emptyText || t('common.noMatchingResults')}
                    />
                  </td>
                </tr>
              ) : (
                dataSource.map((record, index) => {
                  const recordKey = getRowKey(record, index);
                  const rowProps = onRow?.(record, index) || {};

                  const hasClick = Boolean(rowProps.onClick);
                  return (
                    <tr
                      key={`${recordKey}-${index}`}
                      className={cn(
                        'border-b border-theme-neutral-5 hover:bg-gray-50 transition-colors',
                        rowProps.className,
                        index % 2 !== 0 ? 'bg-[#F5F7FA]' : 'bg-white',
                        hasClick && 'cursor-pointer'
                      )}
                      onClick={rowProps.onClick}
                      onDoubleClick={rowProps.onDoubleClick}
                      onContextMenu={rowProps.onContextMenu}
                    >
                      {flattenedColumns.map((column, colIndex) => {
                        const value = column.dataIndex
                          ? record[column.dataIndex]
                          : record;
                        const cellContent = column.render
                          ? column.render(value, record, index)
                          : value;

                        return (
                          <td
                            key={column.key}
                            className={cn(
                              'p-3 text-[16px] text-theme-neutral-11',
                              horizontalScroll && 'whitespace-nowrap',
                              column.align === 'center' && 'text-center',
                              column.align === 'right' && 'text-right',
                              column.className
                            )}
                            style={{
                              minWidth: horizontalScroll
                                ? column.minWidth || column.width
                                : undefined,
                            }}
                          >
                            {cellContent as React.ReactNode}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {loading && dataSource.length > 0 && (
            <TableLoadingOverlay text={loadingText} />
          )}
        </div>

        {pagination && !loading && !error && dataSource.length > 0 && (
          <div className="border-t border-theme-neutral-5">
            <Pagination
              currentPage={pagination.current}
              totalPages={Math.ceil(pagination.total / pagination.pageSize)}
              totalItems={pagination.total}
              itemsPerPage={pagination.pageSize}
              onPageChange={page =>
                pagination.onChange?.(page, pagination.pageSize)
              }
              onItemsPerPageChange={pagination?.onShowSizeChange || (() => {})}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { CustomTable };
