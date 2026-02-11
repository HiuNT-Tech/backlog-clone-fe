import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const replaceWithUpdatedSearchParams = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  updater: (params: URLSearchParams) => void
) => {
  const params = new URLSearchParams(searchParams.toString());
  updater(params);
  const queryString = params.toString();

  router.replace(queryString ? `${pathname}?${queryString}` : pathname);
};
