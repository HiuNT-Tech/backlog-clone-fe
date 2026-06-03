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
import { cloneDeep } from 'lodash';

import { MouseSensor, TouchSensor } from '@/customLibraries/DndKitSensors';
import ListColumns from './ListColumns/ListColumns';
import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';
import type {
  Board,
  Column as ColumnType,
  Card as CardType,
  EntityId,
} from '@/config/interface';
import { sortByPosition, withSequentialPositions } from '@/utils/sorts';

const CARD_LIST_ID_PREFIX = 'cards-';
const COLUMN_ID_PREFIX = 'column-';

const toPositiveEntityId = (
  value?: UniqueIdentifier | string | number | null
): EntityId | undefined => {
  if (value === undefined || value === null || value === '') return undefined;

  const id = typeof value === 'number' ? value : Number(value);

  return Number.isInteger(id) && id > 0 ? id : undefined;
};

const isCardListDroppableId = (id: UniqueIdentifier): boolean =>
  id.toString().startsWith(CARD_LIST_ID_PREFIX);

const isColumnDroppableId = (id: UniqueIdentifier): boolean =>
  id.toString().startsWith(COLUMN_ID_PREFIX);

// Helper to resolve a dnd-kit UniqueIdentifier to the real column EntityId
const resolveColumnId = (id: UniqueIdentifier): EntityId | undefined => {
  const str = id.toString();
  if (str.startsWith(COLUMN_ID_PREFIX)) {
    return toPositiveEntityId(str.replace(COLUMN_ID_PREFIX, ''));
  }
  return undefined;
};

const resolveCardListColumnId = (
  id: UniqueIdentifier
): EntityId | undefined => {
  const str = id.toString();
  if (str.startsWith(CARD_LIST_ID_PREFIX)) {
    return toPositiveEntityId(str.replace(CARD_LIST_ID_PREFIX, ''));
  }
  return undefined;
};

const isRealCard = (card: CardType): boolean => !card.FE_PlaceholderCard;

const normalizeColumnsForDnd = (columns: ColumnType[]): ColumnType[] => {
  return sortByPosition(columns).map(column => ({
    ...column,
    cards: sortByPosition(column.cards?.filter(isRealCard) || []),
  }));
};

const findColumnByCardId = (
  columns: ColumnType[],
  cardId: UniqueIdentifier
): ColumnType | undefined => {
  const realCardId = toPositiveEntityId(cardId);
  if (!realCardId) return undefined;

  return columns.find(column =>
    column.cards.some(card => isRealCard(card) && card.id === realCardId)
  );
};

const findColumnByDroppableId = (
  columns: ColumnType[],
  id: UniqueIdentifier
): ColumnType | undefined => {
  const columnByCard = findColumnByCardId(columns, id);
  if (columnByCard) return columnByCard;

  const cardListColumnId = resolveCardListColumnId(id);
  if (cardListColumnId) {
    return columns.find(column => column.id === cardListColumnId);
  }

  const sortableColumnId = resolveColumnId(id);
  if (sortableColumnId) {
    return columns.find(column => column.id === sortableColumnId);
  }

  const rawColumnId = toPositiveEntityId(id);
  return rawColumnId
    ? columns.find(column => column.id === rawColumnId)
    : undefined;
};

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
  moveCardInTheSameColumn?: (cards: CardType[], columnId: EntityId) => void;
  moveCardToDifferentColumn?: (
    cardId: EntityId,
    oldColumnId: EntityId,
    newColumnId: EntityId,
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
    cardId: EntityId;
    oldColumnId: EntityId;
    newColumnId: EntityId;
    columns: ColumnType[];
  } | null>(null);

  const lastOverId = useRef<UniqueIdentifier | null>(null);

  useEffect(() => {
    setOrderedColumns(normalizeColumnsForDnd(board.columns));
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

  const findOrderedColumnByCardId = (
    cardId: UniqueIdentifier
  ): ColumnType | undefined => {
    return findColumnByCardId(orderedColumns, cardId);
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
    const activeDraggingEntityId = toPositiveEntityId(activeDraggingCardId);
    if (!activeDraggingEntityId) return;

    setOrderedColumns(prevColumns => {
      const overCardEntityId = toPositiveEntityId(overCardId);
      const overCardIndex = overCardEntityId
        ? overColumn.cards.findIndex(card => card.id === overCardEntityId)
        : -1;

      const isBelowOverItem =
        active.rect.current.translated &&
        over &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      const newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn.cards.filter(isRealCard).length;

      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        column => column.id === activeColumn.id
      );
      const nextOverColumn = nextColumns.find(
        column => column.id === overColumn.id
      );

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          card => isRealCard(card) && card.id !== activeDraggingEntityId
        );

        nextActiveColumn.cards = withSequentialPositions(
          nextActiveColumn.cards
        );
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => isRealCard(card) && card.id !== activeDraggingEntityId
        );

        const rebuildActiveDraggingCardData: CardType = {
          ...activeDraggingCardData,
          columnId: nextOverColumn.id,
        };

        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuildActiveDraggingCardData
        );

        nextOverColumn.cards = withSequentialPositions(nextOverColumn.cards);
      }

      if (triggerFrom === 'handleDragEnd') {
        // Store callback data to invoke after state update
        const oldColumnId = oldColumnWhenDraggingCard?.id;
        const newColumnId = nextOverColumn?.id;
        if (!oldColumnId || !newColumnId) return nextColumns;

        setDragEndCallbackData({
          cardId: activeDraggingEntityId,
          oldColumnId,
          newColumnId,
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
        findOrderedColumnByCardId(event?.active?.id) || null
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

    const activeColumn = findOrderedColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByDroppableId(orderedColumns, overCardId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id !== overColumn.id) {
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

      const activeColumn = findOrderedColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByDroppableId(orderedColumns, overCardId);

      if (!activeColumn || !overColumn) return;

      if (oldColumnWhenDraggingCard?.id !== overColumn.id) {
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
        const activeCardId = toPositiveEntityId(activeDragItemId);
        const overCardEntityId = toPositiveEntityId(overCardId);
        const realCards = oldColumnWhenDraggingCard.cards.filter(isRealCard);
        const oldCardIndex = activeCardId
          ? realCards.findIndex(c => c.id === activeCardId)
          : -1;
        const newCardIndex = overCardEntityId
          ? realCards.findIndex(c => c.id === overCardEntityId)
          : realCards.length - 1;

        if (oldCardIndex >= 0 && newCardIndex >= 0) {
          const dndOrderedCards = arrayMove(
            realCards,
            oldCardIndex,
            newCardIndex
          );
          const positionedCards = withSequentialPositions(dndOrderedCards);

          setOrderedColumns(prevColumns => {
            const nextColumns = cloneDeep(prevColumns);
            const targetColumn = nextColumns.find(
              column => column.id === overColumn.id
            );

            if (targetColumn) {
              targetColumn.cards = positionedCards;
            }

            return nextColumns;
          });

          if (moveCardInTheSameColumn) {
            moveCardInTheSameColumn(
              positionedCards,
              oldColumnWhenDraggingCard.id
            );
          }
        }
      }
    }

    // Handle column drag and drop
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const activeColId = resolveColumnId(active.id);
        const overColId = resolveColumnId(over.id);
        if (!activeColId || !overColId) return;

        const oldColumnIndex = orderedColumns.findIndex(
          c => c.id === activeColId
        );
        const newColumnIndex = orderedColumns.findIndex(
          c => c.id === overColId
        );
        if (oldColumnIndex < 0 || newColumnIndex < 0) return;

        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );
        const positionedColumns = withSequentialPositions(dndOrderedColumns);

        setOrderedColumns(positionedColumns);

        if (moveColumns) {
          moveColumns(positionedColumns);
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

      if (!pointerIntersections?.length) {
        return lastOverId.current ? [{ id: lastOverId.current }] : [];
      }

      let overId = getFirstCollision(pointerIntersections, 'id');

      if (overId) {
        const isColumnTarget =
          isCardListDroppableId(overId) || isColumnDroppableId(overId);
        const checkColumn = isColumnTarget
          ? findColumnByDroppableId(orderedColumns, overId)
          : undefined;

        if (checkColumn) {
          const filteredContainers = args.droppableContainers.filter(
            container => {
              const cardId = toPositiveEntityId(container.id);

              return (
                cardId !== undefined &&
                checkColumn.cards.some(
                  card => isRealCard(card) && card.id === cardId
                )
              );
            }
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
      <div className="w-full h-full bg-[#d9d9d9] py-2.5">
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
