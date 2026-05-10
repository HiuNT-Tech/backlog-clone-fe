import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CardService } from '@/lib/apis/card';
import type { Card } from '@/config/interface';

export const useCardDetail = (cardId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: card,
    isLoading,
    error,
    refetch: refetchCard,
  } = useQuery<Card>({
    queryKey: ['card-detail', cardId],
    queryFn: () => CardService.getDetail(cardId!),
    enabled: !!cardId,
  });

  const { mutateAsync: updateCard, isPending: isUpdating } = useMutation({
    mutationFn: (data: Partial<Card>) => CardService.update(cardId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card-detail', cardId] });
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });

  return {
    card: card ?? null,
    isLoading,
    error,
    refetchCard,
    updateCard,
    isUpdating,
  };
};
