import { useState } from 'react';

export interface IPagination {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  apiParams: {
    skip: number;
    limit: number;
  };
}

export const usePagination = (): IPagination => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const apiParams = {
    skip: (page - 1) * limit,
    limit: limit,
  };

  return {
    page,
    limit,
    setPage,
    setLimit: (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
    },
    apiParams,
  };
};
