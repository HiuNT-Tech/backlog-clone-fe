import { useQuery } from '@tanstack/react-query';
import { CardService } from '@/lib/apis/card';
import type {
  CardListParams,
  CardListResponse,
  EntityId,
} from '@/config/interface';

export const useCard = (boardId?: EntityId, params?: CardListParams) => {
  const {
    data = { items: [], total: 0 },
    isLoading,
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
    isLoading,
    cardsError,
    refetchCards,
  };
};
