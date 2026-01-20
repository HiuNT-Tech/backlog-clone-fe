import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import {
  Card,
  Column,
  MoveCardToDifferentColumnRequest,
} from '@/config/interface';

export const useBoard = (boardId: string, columnId: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: board,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => BoardService.getBoard(),
    enabled: !!boardId,
  });

  const {
    mutateAsync: createNewColumn,
    isPending: isCreatePending,
    error: createNewColumnError,
  } = useMutation({
    mutationFn: async (column: Column) => {
      return await BoardService.createNewColumn({ boardId, column });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  const {
    mutateAsync: updateColumnDetails,
    isPending: isUpdatePending,
    error: updateColumnDetailsError,
  } = useMutation({
    mutationFn: async (column: Column) => {
      return await BoardService.updateColumnDetails({
        columnId,
        updateData: column,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  const {
    mutateAsync: deleteColumnDetails,
    isPending: isDeletePending,
    error: deleteColumnDetailsError,
  } = useMutation({
    mutationFn: async (columnId: string) => {
      return await BoardService.deleteColumnDetails({ columnId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  const {
    mutateAsync: moveCardToDifferentColumn,
    isPending: isMovePending,
    error: moveCardToDifferentColumnError,
  } = useMutation({
    mutationFn: async ({
      boardId,
      columnId,
      cardId,
      newColumnId,
    }: MoveCardToDifferentColumnRequest) => {
      return await BoardService.moveCardToDifferentColumn({
        boardId,
        columnId,
        cardId,
        newColumnId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  const {
    mutateAsync: createNewCard,
    isPending: isCreateCardPending,
    error: createNewCardError,
  } = useMutation({
    mutationFn: async (card: Card) => {
      return await BoardService.createNewCard({ card });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
    },
  });

  return {
    board,
    isLoading,
    error,
    refetch,

    createNewColumn,
    isCreatePending,
    createNewColumnError,

    updateColumnDetails,
    isUpdatePending,
    updateColumnDetailsError,

    deleteColumnDetails,
    isDeletePending,
    deleteColumnDetailsError,

    moveCardToDifferentColumn,
    isMovePending,
    moveCardToDifferentColumnError,

    createNewCard,
    isCreateCardPending,
    createNewCardError,
  };
};
