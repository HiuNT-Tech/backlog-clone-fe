import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import { CardService } from '@/lib/apis/card';
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '@/redux/activeBoard/activeBoardSlice';
import { toastHelpers } from '@/hooks/use-toast';
import type {
  Card,
  UpdateCardRequest,
  UserBoardMember,
} from '@/config/interface';

/**
 * Quick inline edits for a card on the board (assignee / due date).
 * Updates the Redux active board optimistically and rolls back on failure.
 */
export const useCardQuickUpdate = (card: Card) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const board = useSelector(selectCurrentActiveBoard);
  const [isUpdating, setIsUpdating] = useState(false);

  const applyPatch = (patch: Partial<Card>) => {
    if (!board) return;
    const newBoard = cloneDeep(board);
    for (const column of newBoard.columns) {
      const idx = column.cards.findIndex(c => c.id === card.id);
      if (idx !== -1) {
        column.cards[idx] = { ...column.cards[idx], ...patch };
        break;
      }
    }
    dispatch(updateCurrentActiveBoard(newBoard));
  };

  const runUpdate = async (
    apiData: UpdateCardRequest,
    patch: Partial<Card>
  ) => {
    if (!board) return;
    const snapshot = board;
    applyPatch(patch);
    setIsUpdating(true);
    try {
      await CardService.update(card.id, apiData);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    } catch {
      dispatch(updateCurrentActiveBoard(snapshot));
      toastHelpers.error({ title: 'Cập nhật thất bại, vui lòng thử lại' });
    } finally {
      setIsUpdating(false);
    }
  };

  const assign = (member: UserBoardMember | null) => {
    if (member) {
      const assigneeUserId = Number(member.userId);
      if (assigneeUserId === Number(card.assigneeUserId)) return;
      return runUpdate(
        { assigneeUserId },
        {
          assigneeUserId,
          assignee: {
            id: assigneeUserId,
            email: member.email,
            displayName: member.displayName,
            avatar: member.avatar,
            isActive: true,
          },
        }
      );
    }

    // Unassign
    if (card.assigneeUserId == null) return;
    return runUpdate(
      { assigneeUserId: null },
      {
        assigneeUserId: null,
        assignee: null,
      }
    );
  };

  const setDueDate = (date: string | null) => {
    // Clearing is not supported by the API, only setting/changing.
    if (!date) return;
    const current = card.dueDate ? card.dueDate.slice(0, 10) : null;
    if (date === current) return;
    return runUpdate({ dueDate: date }, { dueDate: date });
  };

  return { assign, setDueDate, isUpdating };
};
