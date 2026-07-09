import {
  sendDelete,
  sendGet,
  sendPostFormData,
  sendPutFormData,
} from '@/utils/authorizeAxios';
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
    // Gửi dưới dạng multipart/form-data vì comment có thể kèm ảnh / file
    const formData = new FormData();
    formData.append('content', data.content);
    (data.attachments ?? []).forEach(file => {
      formData.append('attachments', file, file.name);
    });
    return await sendPostFormData(
      `${API_ROOT}/v1/cards/${cardId}/comments`,
      formData
    );
  },

  update: async (
    commentId: EntityId,
    data: UpdateCommentRequest
  ): Promise<Comment> => {
    // Multipart để hỗ trợ đính kèm ảnh / file mới khi chỉnh sửa comment
    const formData = new FormData();
    formData.append('content', data.content);
    (data.attachments ?? []).forEach(file => {
      formData.append('attachments', file, file.name);
    });
    (data.removeAttachmentIds ?? []).forEach(id => {
      formData.append('removeAttachmentIds', String(id));
    });
    return await sendPutFormData(
      `${API_ROOT}/v1/comments/${commentId}`,
      formData
    );
  },

  remove: async (commentId: EntityId): Promise<void> => {
    return await sendDelete(`${API_ROOT}/v1/comments/${commentId}`);
  },
};
