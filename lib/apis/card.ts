import { sendGet, sendPut } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type {
  Card,
  CardListParams,
  CardListResponse,
} from '@/config/interface';

export const CardService = {
  getList: async (
    boardId: string,
    params?: CardListParams
  ): Promise<CardListResponse> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}/cards`, params);
  },

  getDetail: async (cardId: string): Promise<Card> => {
    return await sendGet(`${API_ROOT}/v1/cards/${cardId}`);
  },

  update: async (cardId: string, data: Partial<Card>): Promise<Card> => {
    return await sendPut(`${API_ROOT}/v1/cards/${cardId}`, data);
  },
};
