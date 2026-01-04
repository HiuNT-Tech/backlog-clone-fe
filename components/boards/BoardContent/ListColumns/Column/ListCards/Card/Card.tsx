'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Users, MessageSquare, Paperclip } from 'lucide-react';
import Image from 'next/image';
import type { Card as CardType } from '@/config/interface';

interface CardProps {
  card: CardType;
}

function Card({ card }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: { ...card },
  });

  const dndKitCardStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined,
  };

  const shouldShowCardActions = (): boolean => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    );
  };

  // Hide placeholder cards
  if (card?.FE_PlaceholderCard) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      className="cursor-pointer bg-theme-neutral-1 shadow-sm border border-transparent hover:border-theme-main overflow-visible"
    >
      {/* Card Cover Image */}
      {card?.cover && (
        <div className="relative h-36 w-full">
          <Image
            src={card.cover}
            alt={card.title || 'Card cover'}
            fill
            className="object-cover rounded-t-md"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-3">
        <p className="text-theme-neutral-11 text-sm">{card?.title}</p>
      </div>

      {/* Card Actions */}
      {shouldShowCardActions() && (
        <div className="flex items-center gap-2 px-2 pb-2">
          {!!card?.memberIds?.length && (
            <button className="flex items-center gap-1 text-xs text-theme-neutral-7 hover:text-theme-main">
              <Users className="h-4 w-4" />
              <span>{card.memberIds.length}</span>
            </button>
          )}
          {!!card?.comments?.length && (
            <button className="flex items-center gap-1 text-xs text-theme-neutral-7 hover:text-theme-main">
              <MessageSquare className="h-4 w-4" />
              <span>{card.comments.length}</span>
            </button>
          )}
          {!!card?.attachments?.length && (
            <button className="flex items-center gap-1 text-xs text-theme-neutral-7 hover:text-theme-main">
              <Paperclip className="h-4 w-4" />
              <span>{card.attachments.length}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Card;
