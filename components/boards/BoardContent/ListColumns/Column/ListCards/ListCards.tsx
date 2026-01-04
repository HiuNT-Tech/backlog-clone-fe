'use client';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import Card from './Card/Card';
import type { Card as CardType } from '@/config/interface';

interface ListCardsProps {
  cards: CardType[];
  columnId: string;
}

function ListCards({ cards, columnId }: ListCardsProps) {
  // Use unique ID "cards-{columnId}" to avoid conflict with Column sortable ID
  const { setNodeRef } = useDroppable({
    id: `cards-${columnId}`,
    data: { type: 'CardList', columnId },
  });

  return (
    <SortableContext
      items={cards?.map(c => c._id) || []}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="px-1.5 pb-1.5 mx-1.5 flex flex-col gap-2 overflow-x-hidden overflow-y-auto max-h-[calc(100vh-10.8rem)]"
        style={{
          scrollbarColor: '#ced0da transparent',
          minHeight: '40px' /* Ensure empty columns have droppable area */,
        }}
      >
        {cards?.map(card => (
          <Card key={card._id} card={card} />
        ))}
      </div>
    </SortableContext>
  );
}

export default ListCards;
