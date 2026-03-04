'use client';

import { useEffect } from 'react';
import { initDatadog } from '@/lib/datadog';

export const DatadogRum = () => {
  useEffect(() => {
    initDatadog();
  }, []);

  return null;
};
