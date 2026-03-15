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
    params?: { skip: number; limit: number }
  ): Promise<{ items: Version[]; count: number }> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}/versions`, params);
  },

  getDetails: async (id: string): Promise<Version> => {
    return await sendGet(`${API_ROOT}/v1/versions/${id}`);
  },

  createNew: async (payload: CreateVersionRequest): Promise<Version> => {
    return await sendPost(`${API_ROOT}/v1/versions`, payload);
  },

  update: async (
    id: string,
    payload: UpdateVersionRequest
  ): Promise<Version> => {
    return await sendPut(`${API_ROOT}/v1/versions/${id}`, payload);
  },

  delete: async (id: string) => {
    return await sendDelete(`${API_ROOT}/v1/versions/${id}`);
  },
};
