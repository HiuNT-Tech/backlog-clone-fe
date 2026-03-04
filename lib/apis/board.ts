import authorizedAxiosInstance from '@/utils/authorizeAxios';
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
} from '@/config/interface';

export const BoardService = {
  getBoard: async (): Promise<Board[]> => {
    return (await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards`)).data;
  },

  getBoardById: async (boardId: string): Promise<Board> => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    );
    return response.data;
  },

  createNewColumn: async (payload: CreateNewColumnRequest) => {
    const { boardId, title, statusColor } = payload;
    return (
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, {
        boardId,
        title,
        statusColor,
      })
    ).data;
  },

  deleteColumn: async (columnId: string) => {
    return (
      await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
    ).data;
  },

  getColumns: async (boardId: string): Promise<Column[]> => {
    return (
      await authorizedAxiosInstance.get(`${API_ROOT}/v1/columns`, {
        params: {
          boardId,
        },
      })
    ).data;
  },

  moveCardToDifferentColumn: async (
    updateData: MoveCardToDifferentColumnRequest
  ) => {
    return (
      await authorizedAxiosInstance.put(
        `${API_ROOT}/v1/boards/supports/moving_card`,
        updateData
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

  updateBoardDetail: async ({
    boardId,
    updateData,
  }: UpdateBoardDetailRequest) => {
    return (
      await authorizedAxiosInstance.put(
        `${API_ROOT}/v1/boards/${boardId}`,
        updateData
      )
    ).data;
  },

  deleteColumnDetails: async ({ columnId }: { columnId: string }) => {
    return (
      await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
    ).data;
  },

  createNewCard: async (card: CreateNewCardRequest) => {
    return (await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, card))
      .data;
  },

  createNewBoard: async (payload: CreateBoardRequest): Promise<Board> => {
    return (
      await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards`, payload)
    ).data;
  },
};
