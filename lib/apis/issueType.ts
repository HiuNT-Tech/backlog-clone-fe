import { sendGet, sendPost, sendPut, sendDelete } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type {
  CreateIssueTypeRequest,
  EntityId,
  IssueType,
} from '@/config/interface';

export const IssueTypeService = {
  getList: async (
    boardId: EntityId,
    params?: Record<string, any>
  ): Promise<{ items: IssueType[]; count: number }> => {
    return await sendGet(
      `${API_ROOT}/v1/boards/${boardId}/issue-types`,
      params
    );
  },

  createNew: async (
    boardId: EntityId,
    payload: CreateIssueTypeRequest
  ): Promise<IssueType> => {
    return await sendPost(
      `${API_ROOT}/v1/boards/${boardId}/issue-types`,
      payload
    );
  },

  delete: async (boardId: EntityId, id: EntityId) => {
    return await sendDelete(
      `${API_ROOT}/v1/boards/${boardId}/issue-types/${id}`
    );
  },

  edit: async (
    boardId: EntityId,
    id: EntityId,
    payload: CreateIssueTypeRequest
  ) => {
    return await sendPut(
      `${API_ROOT}/v1/boards/${boardId}/issue-types/${id}`,
      payload
    );
  },
};
