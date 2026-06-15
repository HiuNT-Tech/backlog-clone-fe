import { sendGet, sendPost, sendPut, sendDelete } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import {
  Board,
  BoardListResponse,
  CreateBoardRequest,
  CreateNewColumnRequest,
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
  getBoard: async (): Promise<Board[]> => {
    const res = await sendGet(`${API_ROOT}/v1/boards`);
    return res?.items ?? [];
  },

  getBoardById: async (boardId: EntityId): Promise<Board> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}`);
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
    return res?.items ?? [];
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
    return await sendPost(`${API_ROOT}/v1/cards`, card);
  },

  createNewBoard: async (payload: CreateBoardRequest): Promise<Board> => {
    return await sendPost(`${API_ROOT}/v1/boards`, payload);
  },

  getUsersBoard: async (
    boardId?: EntityId,
    params?: UsersBoardParams
  ): Promise<UsersBoardResponse> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}/usersBoard`, params);
  },
};
