import {
  MouseSensor as DndKitMouseSensor,
  TouchSensor as DndKitTouchSensor,
} from '@dnd-kit/core';

/**
 * Block DnD event propagation
 * if element (or its parents) has `data-no-dnd`
 */
const handler = ({
  nativeEvent,
}: {
  nativeEvent: MouseEvent | TouchEvent;
}): boolean => {
  let cur = nativeEvent.target as HTMLElement | null;

  while (cur) {
    if (cur.dataset?.noDnd !== undefined) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
};

export class MouseSensor extends DndKitMouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown' as const,
      handler,
    },
  ];
}

export class TouchSensor extends DndKitTouchSensor {
  static activators = [
    {
      eventName: 'onTouchStart' as const,
      handler,
    },
  ];
}
