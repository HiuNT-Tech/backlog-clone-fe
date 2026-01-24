'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DropAnimation,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { cloneDeep, isEmpty } from 'lodash';

import { MouseSensor, TouchSensor } from '@/customLibraries/DndKitSensors';
import { generatePlaceholderCard } from '@/utils/formatters';
import ListColumns from './ListColumns/ListColumns';
import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';
import type {
  Board,
  Column as ColumnType,
  Card as CardType,
} from '@/config/interface';

// Drag item type constants
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
} as const;

type DragItemType =
  | (typeof ACTIVE_DRAG_ITEM_TYPE)[keyof typeof ACTIVE_DRAG_ITEM_TYPE]
  | null;

interface BoardContentProps {
  board: Board;
  moveColumns?: (columns: ColumnType[]) => void;
  moveCardInTheSameColumn?: (
    cards: CardType[],
    cardOrderIds: string[],
    columnId: string
  ) => void;
  moveCardToDifferentColumn?: (
    cardId: string,
    oldColumnId: string,
    newColumnId: string,
    columns: ColumnType[]
  ) => void;
}

function BoardContent({
  board,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
}: BoardContentProps) {
  // Sensors configuration
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>([]);
  const [activeDragItemId, setActiveDragItemId] =
    useState<UniqueIdentifier | null>(null);
  const [activeDragItemType, setActiveDragItemType] =
    useState<DragItemType>(null);
  const [activeDragItemData, setActiveDragItemData] = useState<
    ColumnType | CardType | null
  >(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState<ColumnType | null>(null);

  // Store callback data to invoke after state update completes
  const [dragEndCallbackData, setDragEndCallbackData] = useState<{
    cardId: string;
    oldColumnId: string;
    newColumnId: string;
    columns: ColumnType[];
  } | null>(null);

  const lastOverId = useRef<UniqueIdentifier | null>(null);

  useEffect(() => {
    setOrderedColumns(board.columns);
  }, [board]);

  // Invoke moveCardToDifferentColumn callback after state update completes
  useEffect(() => {
    if (dragEndCallbackData && moveCardToDifferentColumn) {
      moveCardToDifferentColumn(
        dragEndCallbackData.cardId,
        dragEndCallbackData.oldColumnId,
        dragEndCallbackData.newColumnId,
        dragEndCallbackData.columns
      );
      setDragEndCallbackData(null);
    }
  }, [dragEndCallbackData, moveCardToDifferentColumn]);

  // Find column by card ID
  const findColumnByCardId = (
    cardId: UniqueIdentifier
  ): ColumnType | undefined => {
    return orderedColumns.find(column =>
      column?.cards?.map(card => card._id)?.includes(cardId as string)
    );
  };

  // Move card between different columns
  const moveCardBetweenDifferentColumns = (
    overColumn: ColumnType,
    overCardId: UniqueIdentifier,
    active: DragOverEvent['active'] | DragEndEvent['active'],
    over: DragOverEvent['over'] | DragEndEvent['over'],
    activeColumn: ColumnType,
    activeDraggingCardId: UniqueIdentifier,
    activeDraggingCardData: CardType,
    triggerFrom: 'handleDragOver' | 'handleDragEnd'
  ) => {
    setOrderedColumns(prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(
        card => card._id === overCardId
      );

      const isBelowOverItem =
        active.rect.current.translated &&
        over &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      const newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        column => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        column => column._id === overColumn._id
      );

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          card => card._id !== activeDraggingCardId
        );

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          card => card._id
        );
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => card._id !== activeDraggingCardId
        );

        const rebuildActiveDraggingCardData: CardType = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };

        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuildActiveDraggingCardData
        );

        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => !card.FE_PlaceholderCard
        );

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          card => card._id
        );
      }

      if (triggerFrom === 'handleDragEnd') {
        // Store callback data to invoke after state update
        setDragEndCallbackData({
          cardId: activeDraggingCardId as string,
          oldColumnId: oldColumnWhenDraggingCard?._id || '',
          newColumnId: nextOverColumn?._id || '',
          columns: nextColumns,
        });
      }

      return nextColumns;
    });
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(
      event?.active?.data?.current as ColumnType | CardType
    );

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(
        findColumnByCardId(event?.active?.id) || null
      );
    }
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    const { active, over } = event;

    if (!active || !over) return;

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;

    const activeColumn = findColumnByCardId(activeDraggingCardId);

    // Check if dropping on column droppable (for empty columns) or on a card
    let overColumn = findColumnByCardId(overCardId);

    // If overColumn not found by card ID, check if over.id is cards-{columnId} droppable
    if (!overColumn) {
      const overIdStr = overCardId.toString();
      if (overIdStr.startsWith('cards-')) {
        const realColumnId = overIdStr.replace('cards-', '');
        overColumn = orderedColumns.find(col => col._id === realColumnId);
      } else {
        overColumn = orderedColumns.find(col => col._id === overCardId);
      }
    }

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData as CardType,
        'handleDragOver'
      );
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    // Handle card drag and drop
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over;

      const activeColumn = findColumnByCardId(activeDraggingCardId);

      // Check if dropping on column droppable (for empty columns) or on a card
      let overColumn = findColumnByCardId(overCardId);

      // If overColumn not found by card ID, check if over.id is cards-{columnId} droppable
      if (!overColumn) {
        const overIdStr = overCardId.toString();
        if (overIdStr.startsWith('cards-')) {
          const realColumnId = overIdStr.replace('cards-', '');
          overColumn = orderedColumns.find(col => col._id === realColumnId);
        } else {
          overColumn = orderedColumns.find(col => col._id === overCardId);
        }
      }

      if (!activeColumn || !overColumn) return;

      if (oldColumnWhenDraggingCard?._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData as CardType,
          'handleDragEnd'
        );
      } else {
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          c => c._id === activeDragItemId
        );
        const newCardIndex = overColumn?.cards?.findIndex(
          c => c._id === overCardId
        );

        if (oldCardIndex !== undefined && newCardIndex !== undefined) {
          const dndOrderedCards = arrayMove(
            oldColumnWhenDraggingCard?.cards || [],
            oldCardIndex,
            newCardIndex
          );
          const dndOrderedCardIds = dndOrderedCards.map(card => card._id);

          setOrderedColumns(prevColumns => {
            const nextColumns = cloneDeep(prevColumns);
            const targetColumn = nextColumns.find(
              column => column._id === overColumn._id
            );

            if (targetColumn) {
              targetColumn.cards = dndOrderedCards;
              targetColumn.cardOrderIds = dndOrderedCardIds;
            }

            return nextColumns;
          });

          if (moveCardInTheSameColumn) {
            moveCardInTheSameColumn(
              dndOrderedCards,
              dndOrderedCardIds,
              oldColumnWhenDraggingCard._id
            );
          }
        }
      }
    }

    // Handle column drag and drop
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(
          c => c._id === active.id
        );
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id);

        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );

        setOrderedColumns(dndOrderedColumns);

        if (moveColumns) {
          moveColumns(dndOrderedColumns);
        }
      }
    }

    // Reset drag state
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  // Drop animation config
  const customDropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  };

  // Collision detection strategy
  const collisionDetectionStrategy = useCallback(
    (args: Parameters<typeof closestCorners>[0]) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      const pointerIntersections = pointerWithin(args);

      if (!pointerIntersections?.length) return [];

      let overId = getFirstCollision(pointerIntersections, 'id');

      if (overId) {
        // Check if overId is a cards-{columnId} droppable or a column
        const overIdStr = overId.toString();
        let checkColumn: ColumnType | undefined;

        if (overIdStr.startsWith('cards-')) {
          const realColumnId = overIdStr.replace('cards-', '');
          checkColumn = orderedColumns.find(col => col._id === realColumnId);
        } else {
          checkColumn = orderedColumns.find(col => col._id === overId);
        }

        if (checkColumn) {
          // Filter to only cards in this column (exclude placeholder cards)
          const filteredContainers = args.droppableContainers.filter(
            container =>
              container.id !== overId &&
              !container.id.toString().startsWith('cards-') &&
              checkColumn?.cardOrderIds?.includes(container.id as string) &&
              !container.id.toString().includes('-placeholder-card')
          );

          // If column has real cards, find closest. Otherwise keep droppable ID as target.
          if (filteredContainers.length > 0) {
            overId = closestCorners({
              ...args,
              droppableContainers: filteredContainers,
            })[0]?.id;
          }
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumns]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full bg-[#d9d9d9] py-2.5">
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData as ColumnType} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData as CardType} />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default BoardContent;
