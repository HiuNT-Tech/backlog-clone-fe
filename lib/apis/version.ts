import { sendGet, sendPost, sendPut, sendDelete } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type {
  Version,
  CreateVersionRequest,
  UpdateVersionRequest,
} from '@/config/interface';

export const VersionService = {
  getList: async (
    boardId?: string,
    params?: Record<string, any>
  ): Promise<{ items: Version[]; count: number }> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}/versions`, params);
  },

  getDetails: async (boardId: string, id: string): Promise<Version> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}/versions/${id}`);
  },

  createNew: async (
    boardId: string,
    payload: CreateVersionRequest
  ): Promise<Version> => {
    return await sendPost(`${API_ROOT}/v1/boards/${boardId}/versions`, payload);
  },

  update: async (
    boardId: string,
    id: string,
    payload: UpdateVersionRequest
  ): Promise<Version> => {
    return await sendPut(
      `${API_ROOT}/v1/boards/${boardId}/versions/${id}`,
      payload
    );
  },

  delete: async (boardId: string, id: string) => {
    return await sendDelete(`${API_ROOT}/v1/boards/${boardId}/versions/${id}`);
  },
};
