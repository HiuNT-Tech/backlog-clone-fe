import authorizedAxiosInstance from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type {
  Version,
  CreateVersionRequest,
  UpdateVersionRequest,
} from '@/config/interface';

export const VersionService = {
  getList: async (boardId?: string): Promise<Version[]> => {
    const params = boardId ? `?boardId=${boardId}` : '';
    const res = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/versions${params}`
    );
    return res.data;
  },

  getDetails: async (id: string): Promise<Version> => {
    const res = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/versions/${id}`
    );
    return res.data;
  },

  createNew: async (payload: CreateVersionRequest): Promise<Version> => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/versions`,
      payload
    );
    return res.data;
  },

  update: async (
    id: string,
    payload: UpdateVersionRequest
  ): Promise<Version> => {
    const res = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/versions/${id}`,
      payload
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/versions/${id}`
    );
    return res.data;
  },
};
