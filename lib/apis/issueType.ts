import { sendGet, sendPost, sendPut, sendDelete } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type { CreateIssueTypeRequest, IssueType } from '@/config/interface';

export const IssueTypeService = {
  getList: async (
    boardId: string,
    params?: { skip: number; limit: number }
  ): Promise<{ items: IssueType[]; count: number }> => {
    return await sendGet(
      `${API_ROOT}/v1/boards/${boardId}/issue-types`,
      params
    );
  },

  createNew: async (
    boardId: string,
    payload: CreateIssueTypeRequest
  ): Promise<IssueType> => {
    return await sendPost(
      `${API_ROOT}/v1/boards/${boardId}/issue-types`,
      payload
    );
  },

  delete: async (boardId: string, id: string) => {
    return await sendDelete(
      `${API_ROOT}/v1/boards/${boardId}/issue-types/${id}`
    );
  },

  edit: async (
    boardId: string,
    id: string,
    payload: CreateIssueTypeRequest
  ) => {
    return await sendPut(
      `${API_ROOT}/v1/boards/${boardId}/issue-types/${id}`,
      payload
    );
  },
};
