---
description: Generate React Query hooks for fetching and mutating data.
---

# React Query Hook Generator

This skill standardizes data fetching and mutation logic using TanStack Query.

## 1. File Structure
-   Hooks should be placed in `hooks/`.
-   Use `use-[resource].ts` naming convention.

## 2. Dependencies
-   `@tanstack/react-query`
-   `react-i18next` (optional)
-   Your API service from `lib/apis/`
-   `toastHelpers` from `hooks/use-toast`

## 3. Standard Template

Use this template for new hooks:

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { [ResourceName]Service } from '@/lib/apis/[resourceName]';
import { toastHelpers } from '@/hooks/use-toast';

export const use[ResourceName] = (id?: string) => {
  const queryClient = useQueryClient();

  // Query: Fetch Data
  const {
    data: [resourceName],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['[resourceName]', id],
    queryFn: () => [ResourceName]Service.getById(id!),
    enabled: !!id,
  });

  // Mutation: Create
  const {
    mutateAsync: create[ResourceName],
    isPending: isCreatePending,
  } = useMutation({
    mutationFn: async (data: any) => {
      return await [ResourceName]Service.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[resourceName]s'] });
      toastHelpers.success({ title: 'Created successfully!' });
    },
    onError: (error: any) => {
      toastHelpers.error({ title: error?.message || 'Failed to create' });
    },
  });

  // Mutation: Update
  const {
    mutateAsync: update[ResourceName],
    isPending: isUpdatePending,
  } = useMutation({
    mutationFn: async (data: any) => {
      return await [ResourceName]Service.update(id!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[resourceName]', id] });
      toastHelpers.success({ title: 'Updated successfully!' });
    },
    onError: (error: any) => {
      toastHelpers.error({ title: error?.message || 'Failed to update' });
    },
  });

  return {
    [resourceName],
    isLoading,
    error,
    refetch,
    create[ResourceName],
    isCreatePending,
    update[ResourceName],
    isUpdatePending,
  };
};
```
