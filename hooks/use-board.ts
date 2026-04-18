import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BoardService } from '@/lib/apis/board';
import { toastHelpers } from '@/hooks/use-toast';
import {
  Board,
  Card,
  Column,
  MoveCardToDifferentColumnRequest,
} from '@/config/interface';

export const useBoard = (boardId: string, columnId?: string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    mutateAsync: createNewColumn,
    isPending: isCreatePending,
    error: createNewColumnError,
  } = useMutation({
    mutationFn: async (data: { title: string }) => {
      return await BoardService.createNewColumn({
        boardId,
        title: data.title,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const {
    mutateAsync: updateColumnDetails,
    isPending: isUpdatePending,
    error: updateColumnDetailsError,
  } = useMutation({
    mutationFn: async (column: Partial<Column>) => {
      return await BoardService.updateColumnDetails({
        columnId: column._id || columnId!,
        updateData: column,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const {
    mutateAsync: updateBoardDetail,
    isPending: isUpdateBoardDetailPending,
    error: updateBoardDetailError,
  } = useMutation({
    mutationFn: async (board: Partial<Board>) => {
      return await BoardService.updateBoardDetail({
        boardId: board._id || boardId,
        updateData: board,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
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
  });

  const {
    mutateAsync: moveCardToDifferentColumn,
    isPending: isMovePending,
    error: moveCardToDifferentColumnError,
  } = useMutation({
    mutationFn: async (data: MoveCardToDifferentColumnRequest) => {
      return await BoardService.moveCardToDifferentColumn(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const {
    mutateAsync: createNewCard,
    isPending: isCreateCardPending,
    error: createNewCardError,
  } = useMutation({
    mutationFn: async (card: {
      boardId: string;
      columnId: string;
      title: string;
    }) => {
      return await BoardService.createNewCard(card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  return {
    createNewColumn,
    isCreatePending,
    createNewColumnError,

    updateColumnDetails,
    isUpdatePending,
    updateColumnDetailsError,

    updateBoardDetail,
    isUpdateBoardDetailPending,
    updateBoardDetailError,

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
