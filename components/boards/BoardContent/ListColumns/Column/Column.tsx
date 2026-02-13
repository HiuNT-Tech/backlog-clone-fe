'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ListCards from './ListCards/ListCards';
import type { Column as ColumnType } from '@/config/interface';
import { Plus } from 'lucide-react';
import AddNewCardPopup, {
  type CardFormData,
} from '@/components/shared/popup/AddNewCardPopup';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '@/redux/activeBoard/activeBoardSlice';
import { BoardService } from '@/lib/apis/board';
import { cloneDeep } from 'lodash';
import { toastHelpers } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateNewCardRequest } from '@/config/interface';
import { useTranslation } from 'react-i18next';

interface ColumnProps {
  column: ColumnType;
}

function Column({ column }: ColumnProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const queryClient = useQueryClient();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: { ...column },
  });

  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);

  const dndKitColumnStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  };

  const orderedCards = column.cards;

  const { mutateAsync: createNewCard, isPending: isCreateCardPending } =
    useMutation({
      mutationFn: async (card: CreateNewCardRequest) => {
        return await BoardService.createNewCard(card);
      },
      onSuccess: createdCard => {
        if (!board) return;

        // Update Redux state locally
        const newBoard = cloneDeep(board);
        const columnToUpdate = newBoard.columns.find(
          col => col._id === createdCard.columnId
        );

        if (columnToUpdate) {
          // If column has placeholder card, remove it and add the new card
          if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
            columnToUpdate.cards = [createdCard];
            columnToUpdate.cardOrderIds = [createdCard._id];
          } else {
            // Otherwise just push to the end
            columnToUpdate.cards.push(createdCard);
            columnToUpdate.cardOrderIds.push(createdCard._id);
          }
        }

        dispatch(updateCurrentActiveBoard(newBoard));
        queryClient.invalidateQueries({ queryKey: ['boards'] });
        toastHelpers.success({ title: t('toast.success.cardCreated') });
        setIsAddCardPopupOpen(false);
      },
      onError: () => {
        toastHelpers.error({ title: t('toast.error.userVerificationFailed') });
      },
    });

  const handleAddCardConfirm = async (cardData: CardFormData) => {
    if (!board) return;

    try {
      const payload: CreateNewCardRequest = {
        boardId: board._id,
        columnId: column._id,
        title: cardData.title.trim(),
        ...(cardData.description && { description: cardData.description }),
        ...(cardData.priority && { priorityId: Number(cardData.priority) }),
        ...(cardData.issueType && { issueTypeId: cardData.issueType }),
        ...(cardData.version && { versionId: cardData.version }),
        ...(cardData.startDate && { startDate: cardData.startDate }),
        ...(cardData.dueDate && { dueDate: cardData.dueDate }),
        ...(cardData.estimatedHours && {
          estimatedHours: cardData.estimatedHours,
        }),
        ...(cardData.actualHours && { actualHours: cardData.actualHours }),
      };

      await createNewCard(payload);
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <div
        {...listeners}
        className="min-w-[300px] max-w-[300px] bg-theme-neutral-3 ml-4 rounded-lg h-full max-h-[calc(100vh-6rem)]"
      >
        <div className="flex flex-row items-center justify-between pr-3">
          {/* Column Header */}
          <div className="h-14 p-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-theme-neutral-11 cursor-pointer">
              {column?.title}
            </h3>
          </div>
          <button
            className="p-2 flex items-center justify-center cursor-pointer hover:bg-theme-main-2 rounded-full transition-colors"
            onClick={() => setIsAddCardPopupOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* List Cards */}
        <ListCards cards={orderedCards} columnId={column._id} />

        {/* Add New Card Popup */}
        <AddNewCardPopup
          isOpen={isAddCardPopupOpen}
          onClose={() => setIsAddCardPopupOpen(false)}
          onConfirm={handleAddCardConfirm}
        />
      </div>
    </div>
  );
}

export default Column;
