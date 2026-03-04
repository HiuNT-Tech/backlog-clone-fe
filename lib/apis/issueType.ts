import authorizedAxiosInstance from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type { CreateIssueTypeRequest, IssueType } from '@/config/interface';

export const IssueTypeService = {
  getList: async (boardId?: string): Promise<IssueType[]> => {
    const params = boardId ? `?boardId=${boardId}` : '';
    const res = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/issue-types${params}`
    );
    return res.data;
  },

  createNew: async (payload: CreateIssueTypeRequest): Promise<IssueType> => {
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/issue-types`,
      payload
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/issue-types/${id}`
    );
    return res.data;
  },
};
