import { sendGet, sendPut } from '@/utils/authorizeAxios';
import { API_ROOT } from '@/utils/constants';
import type {
  Card,
  CardListParams,
  CardListResponse,
  EntityId,
} from '@/config/interface';

export const CardService = {
  getList: async (
    boardId: EntityId,
    params?: CardListParams
  ): Promise<CardListResponse> => {
    return await sendGet(`${API_ROOT}/v1/boards/${boardId}/cards`, params);
  },

  getDetail: async (cardId: EntityId): Promise<Card> => {
    return await sendGet(`${API_ROOT}/v1/cards/${cardId}`);
  },

  update: async (cardId: EntityId, data: Partial<Card>): Promise<Card> => {
    return await sendPut(`${API_ROOT}/v1/cards/${cardId}`, data);
  },
};
