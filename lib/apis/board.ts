import authorizedAxiosInstance from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import {
  Board,
  BoardListResponse,
  Card,
  CreateNewColumnRequest,
  MoveCardToDifferentColumnRequest,
  UpdateColumnDetailsRequest,
} from '@/config/interface';

export const BoardService = {
  getBoard: async (): Promise<BoardListResponse> => {
    return await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards`);
  },

  getBoardById: async (boardId: string): Promise<Board> => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    );
    return response.data;
  },

  createNewColumn: async ({ column }: CreateNewColumnRequest) => {
    return (
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, column)
    ).data;
  },

  moveCardToDifferentColumn: async ({
    boardId,
    columnId,
    cardId,
    newColumnId,
  }: MoveCardToDifferentColumnRequest) => {
    return (
      await authorizedAxiosInstance.post(
        `${API_ROOT}/v1/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`,
        { newColumnId }
      )
    ).data;
  },

  updateColumnDetails: async ({
    columnId,
    updateData,
  }: UpdateColumnDetailsRequest) => {
    return (
      await authorizedAxiosInstance.put(
        `${API_ROOT}/v1/columns/${columnId}`,
        updateData
      )
    ).data;
  },

  deleteColumnDetails: async ({ columnId }: { columnId: string }) => {
    return (
      await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
    ).data;
  },

  createNewCard: async ({ card }: { card: Card }) => {
    return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, card))
      .data;
  },

  registerUser: async ({ user }: { user: Record<string, unknown> }) => {
    return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/users`, user))
      .data;
  },

  verifyUser: async ({ user }: { user: Record<string, unknown> }) => {
    return (
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/verify`, user)
    ).data;
  },
};
