---
description: Generate API service integration files using Axios.
---

# API Service Generator

This skill standardizes API calls using `authorizedAxiosInstance` and consistent request/response handling.

## 1. File Structure
-   API services should be placed in `lib/apis/`.
-   Use camelCase for filenames: `[resourceName].ts`.

## 2. Dependencies
-   `authorizedAxiosInstance` from `@/utils/authorizeAxios`
-   `API_ROOT` from `@/utils/constants`
-   Type interfaces from `@/config/interface`

## 3. Standard Template

Use this template for new API services:

```typescript
import authorizedAxiosInstance from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import {
  [ResourceName],
  [ResourceName]ListResponse,
  Create[ResourceName]Request,
  Update[ResourceName]Request,
} from '@/config/interface';

export const [ResourceName]Service = {
  // GET list - return full response if needed by caller
  get[ResourceName]List: async (): Promise<[ResourceName]ListResponse> => {
    return await authorizedAxiosInstance.get(`${API_ROOT}/v1/[resources]`);
  },

  // GET by ID - return .data directly
  get[ResourceName]ById: async ([resourceName]Id: string): Promise<[ResourceName]> => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/[resources]/${[resourceName]Id}`
    );
    return response.data;
  },

  // POST - return .data
  create[ResourceName]: async (data: Create[ResourceName]Request) => {
    return (
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/[resources]`, data)
    ).data;
  },

  // PUT - use object destructuring for complex params
  update[ResourceName]: async ({
    [resourceName]Id,
    updateData,
  }: Update[ResourceName]Request) => {
    return (
      await authorizedAxiosInstance.put(
        `${API_ROOT}/v1/[resources]/${[resourceName]Id}`,
        updateData
      )
    ).data;
  },

  // DELETE
  delete[ResourceName]: async ({ [resourceName]Id }: { [resourceName]Id: string }) => {
    return (
      await authorizedAxiosInstance.delete(`${API_ROOT}/v1/[resources]/${[resourceName]Id}`)
    ).data;
  },
};
```

## 4. Key Patterns

### Return Patterns
- **List endpoints**: Return full response if caller needs headers/status
- **Other endpoints**: Return `.data` directly

### Function Naming
- Use specific business logic names (e.g., `createNewColumn`, `moveCardToDifferentColumn`)
- Not generic CRUD names

### Parameters
- Simple params: Direct parameter (e.g., `boardId: string`)
- Complex params: Object destructuring with typed interface (e.g., `{ columnId, updateData }: UpdateColumnDetailsRequest`)

## 5. Real Example

From `BoardService`:

```typescript
import authorizedAxiosInstance from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import {
  Board,
  BoardListResponse,
  CreateNewColumnRequest,
  UpdateColumnDetailsRequest,
} from '@/config/interface';

export const BoardService = {
  getBoard: async (): Promise<BoardListResponse> => {
    return await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards`);
  },

  getBoardById: async (boardId: string): Promise<Board> => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    );
    return response.data;
  },

  createNewColumn: async ({ column }: CreateNewColumnRequest) => {
    return (
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, column)
    ).data;
  },

  updateColumnDetails: async ({
    columnId,
    updateData,
  }: UpdateColumnDetailsRequest) => {
    return (
      await authorizedAxiosInstance.put(
        `${API_ROOT}/v1/columns/${columnId}`,
        updateData
      )
    ).data;
  },

  deleteColumnDetails: async ({ columnId }: { columnId: string }) => {
    return (
      await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
    ).data;
  },
};
```
