'use client';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import Card from './Card/Card';
import type { Card as CardType, EntityId } from '@/config/interface';

interface ListCardsProps {
  cards: CardType[];
  columnId: EntityId;
}

function ListCards({ cards, columnId }: ListCardsProps) {
  const realCards = cards.filter(card => !card.FE_PlaceholderCard);

  // Use unique ID "cards-{columnId}" to avoid conflict with Column sortable ID
  const { setNodeRef } = useDroppable({
    id: `cards-${columnId}`,
    data: { type: 'CardList', columnId },
  });

  return (
    <SortableContext
      items={realCards.map(c => c.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className="px-1.5 pb-1.5 mx-1.5 flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto max-h-[calc(100vh-10.8rem)]"
        style={{
          scrollbarColor: '#ced0da transparent',
          minHeight: '40px' /* Ensure empty columns have droppable area */,
        }}
      >
        {realCards.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </SortableContext>
  );
}

export default ListCards;
