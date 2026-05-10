'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { SearchField, SearchFormValues } from '@/types/search-section';

interface UseSearchFormProps {
  fields: SearchField[];
  onSearch?: (values: SearchFormValues) => void;
  onReset?: () => void;
  syncWithUrl?: boolean; // default: true
  urlParamsPrefix?: string; // default: ''
  triggerSearchOnMount?: boolean; // default: true - trigger onSearch when mounting with URL params
}

// Serialize values to URL-safe string
const serializeValue = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

const isMultiSelectField = (field: SearchField) =>
  (field.type === 'select' && field.selectMulti) ||
  field.type === 'multiOptions';

const isEmptyValue = (value: any): boolean => {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};

// Deserialize value from URL string
const deserializeValue = (str: string, field: SearchField): any => {
  if (!str) return undefined;

  // Handle range types (dateRange, timeRange)
  if (field.type === 'dateRange' || field.type === 'timeRange') {
    try {
      return JSON.parse(str);
    } catch {
      return undefined;
    }
  }

  if (isMultiSelectField(field)) {
    try {
      const parsedValue = JSON.parse(str);
      return Array.isArray(parsedValue)
        ? parsedValue.filter(Boolean)
        : parsedValue
          ? [String(parsedValue)]
          : undefined;
    } catch {
      return str ? [str] : undefined;
    }
  }

  return str;
};

export const useSearchForm = ({
  fields,
  onSearch,
  onReset,
  syncWithUrl = true,
  urlParamsPrefix = '',
  triggerSearchOnMount = true,
}: UseSearchFormProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Use refs to store stable references
  const fieldsRef = useRef(fields);
  const onSearchRef = useRef(onSearch);
  const hasTriggeredInitialSearch = useRef(false);
  const prevSearchParamsRef = useRef<string>('');

  // Update refs when props change
  useEffect(() => {
    fieldsRef.current = fields;
    onSearchRef.current = onSearch;
  }, [fields, onSearch]);

  // Get prefixed key for URL params
  const getParamKey = useCallback(
    (fieldId: string) =>
      urlParamsPrefix ? `${urlParamsPrefix}_${fieldId}` : fieldId,
    [urlParamsPrefix]
  );

  // Get values from URL params (stable function without deps that change)
  const getValuesFromUrl = useCallback(
    (currentSearchParams: URLSearchParams) => {
      const values: SearchFormValues = {};

      fieldsRef.current.forEach(field => {
        // First, set default value if exists
        if (field.defaultValue !== undefined) {
          values[field.id] = field.defaultValue;
        }

        // Then, override with URL params if syncWithUrl is enabled
        if (syncWithUrl) {
          const paramKey = getParamKey(field.id);
          const urlValue = currentSearchParams.get(paramKey);
          if (urlValue) {
            const deserializedValue = deserializeValue(urlValue, field);
            if (deserializedValue !== undefined) {
              values[field.id] = deserializedValue;
            }
          }
        }
      });

      return values;
    },
    [syncWithUrl, getParamKey]
  );

  // Check if URL has search params for our fields
  const hasUrlSearchParams = useCallback(
    (currentSearchParams: URLSearchParams) => {
      return fieldsRef.current.some(field => {
        const paramKey = getParamKey(field.id);
        return currentSearchParams.get(paramKey);
      });
    },
    [getParamKey]
  );

  // Initialize form values
  const getInitialValues = useCallback(() => {
    const values: SearchFormValues = {};
    fieldsRef.current.forEach(field => {
      if (field.defaultValue !== undefined) {
        values[field.id] = field.defaultValue;
      }
    });

    // Override with URL params if syncWithUrl is enabled
    if (syncWithUrl) {
      const urlValues = getValuesFromUrl(searchParams);
      Object.assign(values, urlValues);
    }

    return values;
  }, [syncWithUrl, searchParams, getValuesFromUrl]);

  const [values, setValues] = useState<SearchFormValues>(getInitialValues);
  const [isExpanded, setIsExpanded] = useState(false);

  // Trigger onSearch on mount if URL has search params (only once)
  useEffect(() => {
    if (
      !hasTriggeredInitialSearch.current &&
      syncWithUrl &&
      triggerSearchOnMount &&
      onSearchRef.current
    ) {
      if (hasUrlSearchParams(searchParams)) {
        hasTriggeredInitialSearch.current = true;
        const urlValues = getValuesFromUrl(searchParams);
        // Use setTimeout to ensure this runs after component is fully mounted
        setTimeout(() => {
          onSearchRef.current?.(urlValues);
        }, 0);
      }
    }
    // Only run on mount - empty deps array would cause lint warning, so we use refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle browser back/forward - detect URL changes from navigation
  useEffect(() => {
    if (!syncWithUrl) return;

    const currentParamsString = searchParams.toString();

    // Skip if this is the first render or params haven't changed
    if (prevSearchParamsRef.current === '') {
      prevSearchParamsRef.current = currentParamsString;
      return;
    }

    if (prevSearchParamsRef.current === currentParamsString) {
      return;
    }

    prevSearchParamsRef.current = currentParamsString;

    // URL changed (browser back/forward) - sync values
    const newValues = getValuesFromUrl(searchParams);
    setValues(newValues);

    // Trigger search if we have URL params and initial search was already done
    if (
      hasTriggeredInitialSearch.current &&
      triggerSearchOnMount &&
      hasUrlSearchParams(searchParams)
    ) {
      onSearchRef.current?.(newValues);
    }
  }, [
    searchParams,
    syncWithUrl,
    getValuesFromUrl,
    hasUrlSearchParams,
    triggerSearchOnMount,
  ]);

  // Update URL with current values (called only on search)
  const updateUrl = useCallback(
    (newValues: SearchFormValues) => {
      if (!syncWithUrl) return;

      const params = new URLSearchParams(searchParams.toString());

      // Update params for each field
      fieldsRef.current.forEach(field => {
        const paramKey = getParamKey(field.id);
        const value = newValues[field.id];

        if (!isEmptyValue(value)) {
          params.set(paramKey, serializeValue(value));
        } else {
          params.delete(paramKey);
        }
      });

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      prevSearchParamsRef.current = params.toString();
      router.replace(newUrl, { scroll: false });
    },
    [syncWithUrl, searchParams, getParamKey, pathname, router]
  );

  // Handle field value change - only update local state, not URL
  const handleChange = useCallback((fieldId: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [fieldId]: isEmptyValue(value) ? undefined : value,
    }));
  }, []);

  // Handle range field value change (dateRange, timeRange)
  const handleRangeChange = useCallback(
    (fieldId: string, type: 'start' | 'end', value: string) => {
      setValues(prev => ({
        ...prev,
        [fieldId]: {
          ...(prev[fieldId] || { start: undefined, end: undefined }),
          [type]: value,
        },
      }));
    },
    []
  );

  // Handle search button click - update URL and call onSearch
  const handleSearch = useCallback(() => {
    hasTriggeredInitialSearch.current = true;
    updateUrl(values);
    onSearchRef.current?.(values);
  }, [values, updateUrl]);

  // Handle reset button click
  const handleReset = useCallback(() => {
    // Get clean initial values (only defaultValues, no URL params)
    const cleanInitialValues: SearchFormValues = {};
    fieldsRef.current.forEach(field => {
      if (field.defaultValue !== undefined) {
        cleanInitialValues[field.id] = field.defaultValue;
      }
    });

    setValues(cleanInitialValues);

    // Clear URL params
    if (syncWithUrl) {
      const params = new URLSearchParams(searchParams.toString());
      fieldsRef.current.forEach(field => {
        const paramKey = getParamKey(field.id);
        params.delete(paramKey);
      });
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      prevSearchParamsRef.current = params.toString();
      router.replace(newUrl, { scroll: false });
    }

    onReset?.();
  }, [syncWithUrl, searchParams, getParamKey, pathname, router, onReset]);

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return {
    values,
    isExpanded,
    handleChange,
    handleRangeChange,
    handleSearch,
    handleReset,
    toggleExpanded,
  };
};
