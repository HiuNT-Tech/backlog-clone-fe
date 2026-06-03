import { sendGet, sendPost, sendPut, sendDelete } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type {
  Version,
  CreateVersionRequest,
  EntityId,
  UpdateVersionRequest,
} from '@/config/interface';

export const VersionService = {
  getList: async (
    boardId?: EntityId,
    params?: Record<string, any>
  ): Promise<{ items: Version[]; count: number }> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}/versions`, params);
  },

  getDetails: async (boardId: EntityId, id: EntityId): Promise<Version> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}/versions/${id}`);
  },

  createNew: async (
    boardId: EntityId,
    payload: CreateVersionRequest
  ): Promise<Version> => {
    return await sendPost(`${API_ROOT}/v1/boards/${boardId}/versions`, payload);
  },

  update: async (
    boardId: EntityId,
    id: EntityId,
    payload: UpdateVersionRequest
  ): Promise<Version> => {
    return await sendPut(
      `${API_ROOT}/v1/boards/${boardId}/versions/${id}`,
      payload
    );
  },

  delete: async (boardId: EntityId, id: EntityId) => {
    return await sendDelete(`${API_ROOT}/v1/boards/${boardId}/versions/${id}`);
  },
};
