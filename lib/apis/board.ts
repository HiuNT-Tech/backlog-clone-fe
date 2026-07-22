import {
  sendGet,
  sendPost,
  sendPut,
  sendPatch,
  sendDelete,
  sendPostFormData,
} from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import {
  Board,
  BoardDetailParams,
  BoardListResponse,
  CreateBoardRequest,
  CreateNewColumnRequest,
  DuplicateBoardRequest,
  MoveCardToDifferentColumnRequest,
  UpdateColumnDetailsRequest,
  UpdateBoardDetailRequest,
  CreateNewCardRequest,
  Column,
  User,
  UsersBoardParams,
  UsersBoardResponse,
  EntityId,
} from '@/config/interface';

export const BoardService = {
  getBoard: async (): Promise<{ items: Board[]; total: number }> => {
    return await sendGet(`${API_ROOT}/v1/boards`);
  },

  getBoardById: async (
    boardId: EntityId,
    params?: BoardDetailParams
  ): Promise<Board> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}`, params);
  },

  createNewColumn: async (payload: CreateNewColumnRequest) => {
    const { boardId, title, statusColor } = payload;
    return await sendPost(`${API_ROOT}/v1/boards/${boardId}/columns`, {
      title,
      statusColor,
    });
  },

  deleteColumn: async (boardId: EntityId, columnId: EntityId) => {
    return await sendDelete(
      `${API_ROOT}/v1/boards/${boardId}/columns/${columnId}`
    );
  },

  getColumns: async (
    boardId: EntityId,
    params?: Record<string, any>
  ): Promise<Column[]> => {
    const res = await sendGet(
      `${API_ROOT}/v1/boards/${boardId}/columns`,
      params
    );
    return res?.items ?? res ?? [];
  },

  moveCardToDifferentColumn: async (
    updateData: MoveCardToDifferentColumnRequest
  ) => {
    return await sendPut(
      `${API_ROOT}/v1/boards/supports/moving_card`,
      updateData
    );
  },

  updateColumnDetails: async ({
    boardId,
    columnId,
    updateData,
  }: UpdateColumnDetailsRequest) => {
    return await sendPut(
      `${API_ROOT}/v1/boards/${boardId}/columns/${columnId}`,
      updateData
    );
  },

  updateBoardDetail: async ({
    boardId,
    updateData,
  }: UpdateBoardDetailRequest) => {
    return await sendPut(`${API_ROOT}/v1/boards/${boardId}`, updateData);
  },

  deleteColumnDetails: async ({
    boardId,
    columnId,
  }: {
    boardId: EntityId;
    columnId: EntityId;
  }) => {
    return await sendDelete(
      `${API_ROOT}/v1/boards/${boardId}/columns/${columnId}`
    );
  },

  createNewCard: async (card: CreateNewCardRequest) => {
    // Gửi multipart/form-data để hỗ trợ đính kèm ảnh / file khi tạo ticket
    const { attachments, ...fields } = card;
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    (attachments ?? []).forEach(file => {
      formData.append('attachments', file, file.name);
    });
    return await sendPostFormData(`${API_ROOT}/v1/cards`, formData);
  },

  createNewBoard: async (payload: CreateBoardRequest): Promise<Board> => {
    return await sendPost(`${API_ROOT}/v1/boards`, payload);
  },

  duplicateBoard: async (
    sourceBoardId: EntityId,
    payload: DuplicateBoardRequest
  ): Promise<Board> => {
    return await sendPost(
      `${API_ROOT}/v1/boards/${sourceBoardId}/duplicate`,
      payload
    );
  },

  getUsersBoard: async (
    boardId?: EntityId,
    params?: UsersBoardParams
  ): Promise<UsersBoardResponse> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}/usersBoard`, params);
  },

  updateMemberRole: async (
    boardId: EntityId,
    userId: EntityId,
    role: string
  ): Promise<{ userId: EntityId; role: string }> => {
    return await sendPatch(
      `${API_ROOT}/v1/boards/${boardId}/members/${userId}`,
      { role }
    );
  },

  removeMember: async (boardId: EntityId, userId: EntityId): Promise<void> => {
    return await sendDelete(
      `${API_ROOT}/v1/boards/${boardId}/members/${userId}`
    );
  },
};
