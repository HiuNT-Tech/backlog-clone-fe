import { sendDelete, sendGet, sendPost, sendPut } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type {
  Comment,
  CommentListParams,
  CommentListResponse,
  CreateCommentRequest,
  EntityId,
  UpdateCommentRequest,
} from '@/config/interface';

export const CommentService = {
  getList: async (
    cardId: EntityId,
    params?: CommentListParams
  ): Promise<CommentListResponse> => {
    return await sendGet(`${API_ROOT}/v1/cards/${cardId}/comments`, params);
  },

  create: async (
    cardId: EntityId,
    data: CreateCommentRequest
  ): Promise<Comment> => {
    return await sendPost(`${API_ROOT}/v1/cards/${cardId}/comments`, data);
  },

  update: async (
    commentId: EntityId,
    data: UpdateCommentRequest
  ): Promise<Comment> => {
    return await sendPut(`${API_ROOT}/v1/comments/${commentId}`, data);
  },

  remove: async (commentId: EntityId): Promise<void> => {
    return await sendDelete(`${API_ROOT}/v1/comments/${commentId}`);
  },
};
