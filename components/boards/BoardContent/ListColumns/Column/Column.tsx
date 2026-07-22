'use client';

import { memo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ListCards from './ListCards/ListCards';
import type { Column as ColumnType } from '@/config/interface';
import Image from 'next/image';
import Icons from '@/assets/icons';
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
import { toEntityIdOrUndefined } from '@/lib/entity-id';
import { useTranslation } from 'react-i18next';
import { sortByPosition } from '@/utils/sorts';
import { CardPreview } from './ListCards/Card/Card';
import { useBoardRole } from '@/hooks/use-board-role';

interface ColumnProps {
  column: ColumnType;
}

const isRealCard = (card: ColumnType['cards'][number]): boolean =>
  !card.FE_PlaceholderCard;

const COLUMN_CLASS =
  'min-w-[300px] max-w-[300px] bg-theme-neutral-3 ml-4 rounded-lg h-full max-h-[calc(100vh-6rem)] flex flex-col';

export const ColumnPreview = memo(function ColumnPreview({
  column,
}: ColumnProps) {
  const realCards = column.cards.filter(isRealCard);

  return (
    <div className={COLUMN_CLASS}>
      <div className="flex flex-row items-center justify-between pr-3">
        <div className="h-14 p-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-theme-neutral-11">
            {column?.title}
          </h3>
        </div>
      </div>

      <div
        className="px-1.5 pb-1.5 mx-1.5 flex flex-1 flex-col gap-2 overflow-hidden max-h-[calc(100vh-10.8rem)]"
        style={{ minHeight: '40px' }}
      >
        {realCards.map(card => (
          <CardPreview key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
});

function Column({ column }: ColumnProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const { isContributor } = useBoardRole(board?.id);
  const queryClient = useQueryClient();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${column.id}`,
    data: column,
  });

  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);

  const dndKitColumnStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
    willChange: 'transform',
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
          col => col.id === createdCard.columnId
        );

        if (columnToUpdate) {
          if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
            columnToUpdate.cards = [createdCard];
          } else {
            columnToUpdate.cards.push(createdCard);
          }

          columnToUpdate.cards = sortByPosition(columnToUpdate.cards);
        }

        dispatch(updateCurrentActiveBoard(newBoard));
        queryClient.invalidateQueries({ queryKey: ['boards'] });
        toastHelpers.success({ title: t('toast.success.cardCreated') });
        setIsAddCardPopupOpen(false);
      },
    });

  const handleAddCardConfirm = async (cardData: CardFormData) => {
    if (!board) return;

    try {
      const payload: CreateNewCardRequest = {
        boardId: board.id,
        columnId: column.id,
        title: cardData.title.trim(),
        ...(cardData.description && { description: cardData.description }),
        ...(cardData.priority && { priority: Number(cardData.priority) }),
        ...(cardData.assignee && {
          assigneeUserId: toEntityIdOrUndefined(cardData.assignee),
        }),
        ...(cardData.issueType && {
          issueTypeId: toEntityIdOrUndefined(cardData.issueType),
        }),
        ...(cardData.version && {
          versionId: toEntityIdOrUndefined(cardData.version),
        }),
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
    <div ref={setNodeRef} style={dndKitColumnStyles}>
      <div className={COLUMN_CLASS}>
        <div className="flex flex-row items-center justify-between pr-3">
          {/* Column Header — drag handle for column sorting */}
          <div
            {...attributes}
            {...listeners}
            className="h-14 p-4 flex items-center justify-between cursor-grab"
          >
            <h3 className="text-base font-bold text-theme-neutral-11">
              {column?.title}
            </h3>
          </div>
          {isContributor && (
            <button
              className="p-2 flex items-center justify-center cursor-pointer hover:bg-theme-main-2 rounded-full transition-colors"
              onClick={() => setIsAddCardPopupOpen(true)}
            >
              <Image
                src={Icons.Plus}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
              />
            </button>
          )}
        </div>

        {/* List Cards */}
        <ListCards cards={orderedCards} columnId={column.id} />

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

export default memo(Column);
