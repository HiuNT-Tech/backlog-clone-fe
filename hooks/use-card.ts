import { useQuery } from '@tanstack/react-query';
import { CardService } from '@/lib/apis/card';
import type { CardListParams, CardListResponse } from '@/config/interface';

export const useCard = (boardId?: string, params?: CardListParams) => {
  const {
    data = { items: [], total: 0 },
    isLoading: isLoadingList,
    error: cardsError,
    refetch: refetchCards,
  } = useQuery<CardListResponse>({
    queryKey: ['cards', boardId, params],
    queryFn: () => CardService.getList(boardId!, params),
    enabled: !!boardId,
  });

  return {
    cards: data.items,
    totalCount: data.total,
    isLoadingList,
    cardsError,
    refetchCards,
  };
};
